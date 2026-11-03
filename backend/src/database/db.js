import fs from 'fs';
import path from 'path';
import config from '../config/index.js';
import logger from '../utils/logger.js';
import defaultData from './defaultData.js';
import {
  initMysqlSchema,
  loadAllCollectionsFromMysql,
  saveCollectionToMysql,
  saveAllCollectionsToMysql,
  isMysqlActive,
} from './mysql.js';
import { 
  initNeonSchema, 
  loadAllCollectionsFromNeon, 
  saveAllCollectionsToNeon, 
  saveCollectionToNeon 
} from './neon.js';

let memoryDb = null;
let writeQueue = Promise.resolve();
let activeProvider = 'Local Atomic Store (db.json)';

export function getActiveDbProvider() {
  return activeProvider;
}

/**
 * Initializes database from MySQL, Neon PostgreSQL, or disk backup/default seed
 */
export async function initDb() {
  try {
    let cloudLoaded = null;

    // 1. Attempt connection and initialization from MySQL (if configured)
    if (config.mysql && config.mysql.database && config.mysql.user) {
      try {
        logger.info(`Connecting to MySQL database [${config.mysql.database}] on ${config.mysql.host}:${config.mysql.port}...`);
        await initMysqlSchema();
        cloudLoaded = await loadAllCollectionsFromMysql();
        if (cloudLoaded && Object.keys(cloudLoaded).length > 0) {
          activeProvider = `MySQL (${config.mysql.database})`;
          logger.info(`Successfully loaded persistent collections from MySQL database [${config.mysql.database}].`);
        } else {
          activeProvider = `MySQL (${config.mysql.database})`;
          logger.info('MySQL connected. Collections will be seeded to MySQL.');
        }
      } catch (mysqlErr) {
        logger.warn('MySQL connection warning (will fall back to next provider):', mysqlErr.message || mysqlErr);
      }
    }

    // 2. Attempt connection and initialization from Neon PostgreSQL (if MySQL not used)
    if (!cloudLoaded && config.databaseUrl) {
      try {
        logger.info('Connecting to Neon PostgreSQL cloud database...');
        await initNeonSchema();
        const neonLoaded = await loadAllCollectionsFromNeon();
        if (neonLoaded && Object.keys(neonLoaded).length > 0) {
          cloudLoaded = neonLoaded;
          activeProvider = 'Neon PostgreSQL (Cloud)';
          logger.info('Successfully loaded persistent collections from Neon PostgreSQL.');
        }
      } catch (neonErr) {
        logger.warn('Neon PostgreSQL connection warning (will fall back to local store if needed):', neonErr.message || neonErr);
      }
    }

    if (cloudLoaded && Object.keys(cloudLoaded).length > 0) {
      // Validate and structure loaded collections
      memoryDb = {
        products: Array.isArray(cloudLoaded.products) ? cloudLoaded.products : defaultData.products,
        categories: Array.isArray(cloudLoaded.categories) ? cloudLoaded.categories : defaultData.categories,
        orders: Array.isArray(cloudLoaded.orders) ? cloudLoaded.orders : defaultData.orders,
        quotes: Array.isArray(cloudLoaded.quotes) ? cloudLoaded.quotes : defaultData.quotes,
        settings: cloudLoaded.settings && typeof cloudLoaded.settings === 'object' ? cloudLoaded.settings : defaultData.settings,
        testimonials: Array.isArray(cloudLoaded.testimonials) ? cloudLoaded.testimonials : defaultData.testimonials,
        adminAuth: cloudLoaded.adminAuth && typeof cloudLoaded.adminAuth === 'object' ? cloudLoaded.adminAuth : defaultData.adminAuth,
        customerMessages: Array.isArray(cloudLoaded.customerMessages) ? cloudLoaded.customerMessages : (defaultData.customerMessages || []),
      };

      // Keep local disk mirror synchronized
      await writeToDiskAtomic(memoryDb).catch(() => {});
    } else {
      // Fallback: Read from local disk or defaultData
      const sourceDbFile = fs.existsSync(config.paths.dbFile)
        ? config.paths.dbFile
        : (fs.existsSync(path.join(config.paths.root, 'db.json')) ? path.join(config.paths.root, 'db.json') : null);

      if (!sourceDbFile) {
        logger.info('Database file not found. Seeding initial database from defaults...');
        memoryDb = JSON.parse(JSON.stringify(defaultData));
      } else {
        const raw = await fs.promises.readFile(sourceDbFile, 'utf-8');
        const parsed = JSON.parse(raw);
        memoryDb = {
          products: Array.isArray(parsed.products) ? parsed.products : defaultData.products,
          categories: Array.isArray(parsed.categories) ? parsed.categories : defaultData.categories,
          orders: Array.isArray(parsed.orders) ? parsed.orders : defaultData.orders,
          quotes: Array.isArray(parsed.quotes) ? parsed.quotes : defaultData.quotes,
          settings: parsed.settings && typeof parsed.settings === 'object' ? parsed.settings : defaultData.settings,
          testimonials: Array.isArray(parsed.testimonials) ? parsed.testimonials : defaultData.testimonials,
          adminAuth: parsed.adminAuth && typeof parsed.adminAuth === 'object' ? parsed.adminAuth : defaultData.adminAuth,
          customerMessages: Array.isArray(parsed.customerMessages) ? parsed.customerMessages : (defaultData.customerMessages || []),
        };
      }

      await writeToDiskAtomic(memoryDb).catch(() => {});

      // Seed to MySQL if connection active
      if (isMysqlActive()) {
        saveAllCollectionsToMysql(memoryDb).catch((err) => {
          logger.warn('Could not seed initial collections to MySQL:', err.message || err);
        });
      }
      // Or seed to Neon PostgreSQL if connection available
      else if (config.databaseUrl) {
        saveAllCollectionsToNeon(memoryDb).catch((err) => {
          logger.warn('Could not seed initial collections to Neon:', err.message || err);
        });
      }
    }

    logger.info(`Database initialized successfully [Provider: ${activeProvider}]. Collections: [products: ${memoryDb.products.length}, categories: ${memoryDb.categories.length}, orders: ${memoryDb.orders.length}, quotes: ${memoryDb.quotes.length}, messages: ${memoryDb.customerMessages.length}]`);

    // Create startup safety backup
    await backupDb();
    return memoryDb;
  } catch (err) {
    logger.error('Failed to initialize database, falling back to default seed:', err);
    memoryDb = JSON.parse(JSON.stringify(defaultData));
    await writeToDiskAtomic(memoryDb);
    return memoryDb;
  }
}

/**
 * Returns current snapshot of database
 */
export function getDb() {
  if (!memoryDb) {
    // Synchronous fallback read if called prior to async init
    try {
      const sourceDbFile = fs.existsSync(config.paths.dbFile)
        ? config.paths.dbFile
        : (fs.existsSync(path.join(config.paths.root, 'db.json')) ? path.join(config.paths.root, 'db.json') : null);

      if (sourceDbFile) {
        const raw = JSON.parse(fs.readFileSync(sourceDbFile, 'utf-8'));
        memoryDb = {
          ...raw,
          customerMessages: Array.isArray(raw.customerMessages) ? raw.customerMessages : (defaultData.customerMessages || []),
        };
      } else {
        memoryDb = JSON.parse(JSON.stringify(defaultData));
      }
    } catch {
      memoryDb = JSON.parse(JSON.stringify(defaultData));
    }
  }
  return memoryDb;
}

/**
 * Atomic disk writer using a temporary file and atomic rename
 */
async function writeToDiskAtomic(data) {
  const content = JSON.stringify(data, null, 2);
  const tempPath = `${config.paths.dbFile}.tmp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

  try {
    await fs.promises.writeFile(tempPath, content, 'utf-8');
    try {
      await fs.promises.rename(tempPath, config.paths.dbFile);
    } catch (renameErr) {
      // Windows file lock fallback
      await fs.promises.copyFile(tempPath, config.paths.dbFile);
      await fs.promises.unlink(tempPath).catch(() => {});
    }
    return true;
  } catch (err) {
    logger.warn('Disk write warning (ephemeral/read-only environment):', err.message || err);
    try {
      if (fs.existsSync(tempPath)) {
        await fs.promises.unlink(tempPath);
      }
    } catch (_) {}
    return false;
  }
}

/**
 * Queued async database update to prevent race conditions
 */
export function saveDb(newData) {
  memoryDb = { ...memoryDb, ...newData };

  writeQueue = writeQueue
    .then(async () => {
      await writeToDiskAtomic(memoryDb);
      if (isMysqlActive()) {
        await saveAllCollectionsToMysql(newData).catch((err) => {
          logger.warn('Failed to sync changes to MySQL:', err.message || err);
        });
      } else if (config.databaseUrl) {
        await saveAllCollectionsToNeon(newData).catch((err) => {
          logger.warn('Failed to sync changes to Neon PostgreSQL:', err.message || err);
        });
      }
    })
    .catch((err) => {
      logger.error('Write queue error:', err);
    });

  return writeQueue;
}

/**
 * Atomic updater function that executes against latest state
 */
export async function updateDb(updater) {
  return new Promise((resolve, reject) => {
    writeQueue = writeQueue
      .then(async () => {
        const current = getDb();
        const updated = await updater(current);
        if (updated) {
          memoryDb = updated;
        }
        await writeToDiskAtomic(memoryDb);
        if (isMysqlActive()) {
          saveAllCollectionsToMysql(memoryDb).catch((err) => {
            logger.warn('Failed to sync update to MySQL:', err.message || err);
          });
        } else if (config.databaseUrl) {
          saveAllCollectionsToNeon(memoryDb).catch((err) => {
            logger.warn('Failed to sync update to Neon PostgreSQL:', err.message || err);
          });
        }
        resolve(memoryDb);
      })
      .catch((err) => {
        logger.error('Failed to update DB:', err);
        reject(err);
      });
  });
}

/**
 * Creates backup file
 */
export async function backupDb() {
  try {
    const current = getDb();
    await fs.promises.writeFile(config.paths.dbBackup, JSON.stringify(current, null, 2), 'utf-8');
    return true;
  } catch (err) {
    logger.warn('Failed to create database backup:', err);
    return false;
  }
}

export default {
  initDb,
  getDb,
  saveDb,
  updateDb,
  backupDb,
  getActiveDbProvider,
};
