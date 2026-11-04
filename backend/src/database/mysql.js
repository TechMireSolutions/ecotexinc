import mysql from 'mysql2/promise';
import config from '../config/index.js';
import logger from '../utils/logger.js';

let pool = null;
let isConnected = false;

/**
 * Returns or initializes MySQL connection pool
 */
export function getPool() {
  if (!pool && config.mysql && config.mysql.database) {
    try {
      pool = mysql.createPool({
        host: config.mysql.host,
        port: config.mysql.port,
        user: config.mysql.user,
        password: config.mysql.password,
        database: config.mysql.database,
        ssl: config.mysql.ssl ? { rejectUnauthorized: false } : undefined,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 10000,
        connectTimeout: 8000,
      });
    } catch (err) {
      logger.error('Failed to create MySQL pool:', err.message || err);
      pool = null;
    }
  }
  return pool;
}

export function isMysqlActive() {
  return isConnected && pool !== null;
}

/**
 * Tests connection and initializes table schemas in MySQL
 */
export async function initMysqlSchema() {
  const p = getPool();
  if (!p) throw new Error('MySQL pool not initialized');

  // Verify active connection
  const conn = await p.getConnection();
  try {
    await conn.query('SELECT 1');
    isConnected = true;
    logger.info(`Connected to MySQL server successfully [${config.mysql.database}].`);

    // 1. Primary Unified Collection Store (Longtext preserves complete JSON schema)
    await conn.query(`
      CREATE TABLE IF NOT EXISTS ecotex_store (
        collection_name VARCHAR(64) PRIMARY KEY,
        data LONGTEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 2. Products table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(128) PRIMARY KEY,
        name VARCHAR(255),
        category VARCHAR(128),
        in_stock BOOLEAN DEFAULT true,
        data LONGTEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 3. Categories table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id VARCHAR(128) PRIMARY KEY,
        name VARCHAR(255),
        slug VARCHAR(128),
        data LONGTEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 4. Orders table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(128) PRIMARY KEY,
        order_number VARCHAR(128),
        customer_name VARCHAR(255),
        customer_email VARCHAR(255),
        status VARCHAR(64),
        total_amount DECIMAL(12, 2) DEFAULT 0.00,
        data LONGTEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 5. Quotes table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS quotes (
        id VARCHAR(128) PRIMARY KEY,
        contact_name VARCHAR(255),
        email VARCHAR(255),
        status VARCHAR(64),
        data LONGTEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 6. Customer Messages table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS customer_messages (
        id VARCHAR(128) PRIMARY KEY,
        customer_name VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(64),
        status VARCHAR(64),
        data LONGTEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 7. Site Settings table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        id VARCHAR(64) PRIMARY KEY,
        data LONGTEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 8. Admin Auth table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS admin_auth (
        id VARCHAR(64) PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(64) DEFAULT 'Super Admin',
        data LONGTEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 9. Testimonials table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id VARCHAR(128) PRIMARY KEY,
        author VARCHAR(255),
        role VARCHAR(255),
        company VARCHAR(255),
        rating INT DEFAULT 5,
        content TEXT,
        data LONGTEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    logger.info('MySQL database tables verified and ready.');
  } finally {
    conn.release();
  }
}

/**
 * Loads all collections from MySQL
 */
export async function loadAllCollectionsFromMysql() {
  const p = getPool();
  if (!p || !isConnected) return null;

  try {
    const [rows] = await p.query('SELECT collection_name, data FROM ecotex_store');
    if (rows && rows.length > 0) {
      const result = {};
      for (const row of rows) {
        try {
          result[row.collection_name] = JSON.parse(row.data);
        } catch (e) {
          logger.warn(`Failed to parse collection ${row.collection_name} from MySQL:`, e.message);
        }
      }
      return result;
    }

    // Fallback: If ecotex_store is empty but individual relational tables have data
    const result = {};
    try {
      const [prodRows] = await p.query('SELECT data FROM products');
      if (prodRows && prodRows.length > 0) {
        result.products = prodRows.map((r) => JSON.parse(r.data));
      }
      const [catRows] = await p.query('SELECT data FROM categories');
      if (catRows && catRows.length > 0) {
        result.categories = catRows.map((r) => JSON.parse(r.data));
      }
      const [orderRows] = await p.query('SELECT data FROM orders');
      if (orderRows && orderRows.length > 0) {
        result.orders = orderRows.map((r) => JSON.parse(r.data));
      }
      const [quoteRows] = await p.query('SELECT data FROM quotes');
      if (quoteRows && quoteRows.length > 0) {
        result.quotes = quoteRows.map((r) => JSON.parse(r.data));
      }
      const [msgRows] = await p.query('SELECT data FROM customer_messages');
      if (msgRows && msgRows.length > 0) {
        result.customerMessages = msgRows.map((r) => JSON.parse(r.data));
      }
      const [setRows] = await p.query('SELECT data FROM site_settings WHERE id = "current" LIMIT 1');
      if (setRows && setRows.length > 0) {
        result.settings = JSON.parse(setRows[0].data);
      }
      const [authRows] = await p.query('SELECT data FROM admin_auth WHERE id = "default" LIMIT 1');
      if (authRows && authRows.length > 0) {
        result.adminAuth = JSON.parse(authRows[0].data);
      }
      const [testRows] = await p.query('SELECT data FROM testimonials');
      if (testRows && testRows.length > 0) {
        result.testimonials = testRows.map((r) => JSON.parse(r.data));
      }
    } catch (_) {}

    return Object.keys(result).length > 0 ? result : null;
  } catch (err) {
    logger.error('Error fetching collections from MySQL:', err.message || err);
    return null;
  }
}

/**
 * Syncs a single collection to MySQL
 */
export async function saveCollectionToMysql(collectionName, data) {
  const p = getPool();
  if (!p || !isConnected) return;

  try {
    const jsonStr = JSON.stringify(data);

    // 1. Update unified store
    await p.query(
      `INSERT INTO ecotex_store (collection_name, data, updated_at)
       VALUES (?, ?, NOW())
       ON DUPLICATE KEY UPDATE data = VALUES(data), updated_at = NOW()`,
      [collectionName, jsonStr]
    );

    // 2. Sync individual relational tables
    try {
      if (collectionName === 'products' && Array.isArray(data)) {
        for (const prod of data) {
          if (!prod || !prod.id) continue;
          await p.query(
            `INSERT INTO products (id, name, category, in_stock, data, updated_at)
             VALUES (?, ?, ?, ?, ?, NOW())
             ON DUPLICATE KEY UPDATE name = VALUES(name), category = VALUES(category), in_stock = VALUES(in_stock), data = VALUES(data), updated_at = NOW()`,
            [prod.id, prod.name || '', prod.category || '', prod.inStock !== false ? 1 : 0, JSON.stringify(prod)]
          );
        }
      } else if (collectionName === 'categories' && Array.isArray(data)) {
        for (const cat of data) {
          if (!cat || !cat.id) continue;
          await p.query(
            `INSERT INTO categories (id, name, slug, data, updated_at)
             VALUES (?, ?, ?, ?, NOW())
             ON DUPLICATE KEY UPDATE name = VALUES(name), slug = VALUES(slug), data = VALUES(data), updated_at = NOW()`,
            [cat.id, cat.label || cat.name || '', cat.id, JSON.stringify(cat)]
          );
        }
      } else if (collectionName === 'orders' && Array.isArray(data)) {
        for (const ord of data) {
          if (!ord || !ord.id) continue;
          const total = parseFloat(ord.total || ord.pricing?.total || 0) || 0;
          await p.query(
            `INSERT INTO orders (id, order_number, customer_name, customer_email, status, total_amount, data, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
             ON DUPLICATE KEY UPDATE order_number = VALUES(order_number), customer_name = VALUES(customer_name), customer_email = VALUES(customer_email), status = VALUES(status), total_amount = VALUES(total_amount), data = VALUES(data), updated_at = NOW()`,
            [ord.id, ord.orderNumber || ord.id, ord.customer?.name || ord.customerName || '', ord.customer?.email || ord.customerEmail || '', ord.status || 'Pending', total, JSON.stringify(ord)]
          );
        }
      } else if (collectionName === 'quotes' && Array.isArray(data)) {
        for (const q of data) {
          if (!q || !q.id) continue;
          await p.query(
            `INSERT INTO quotes (id, contact_name, email, status, data, updated_at)
             VALUES (?, ?, ?, ?, ?, NOW())
             ON DUPLICATE KEY UPDATE contact_name = VALUES(contact_name), email = VALUES(email), status = VALUES(status), data = VALUES(data), updated_at = NOW()`,
            [q.id, q.name || q.contactName || '', q.email || '', q.status || 'Pending', JSON.stringify(q)]
          );
        }
      } else if (collectionName === 'customerMessages' && Array.isArray(data)) {
        for (const msg of data) {
          if (!msg || !msg.id) continue;
          await p.query(
            `INSERT INTO customer_messages (id, customer_name, email, phone, status, data, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, NOW())
             ON DUPLICATE KEY UPDATE customer_name = VALUES(customer_name), email = VALUES(email), phone = VALUES(phone), status = VALUES(status), data = VALUES(data), updated_at = NOW()`,
            [msg.id, msg.customerName || '', msg.email || '', msg.phone || '', msg.status || 'New', JSON.stringify(msg)]
          );
        }
      } else if (collectionName === 'settings' && data && typeof data === 'object') {
        await p.query(
          `INSERT INTO site_settings (id, data, updated_at)
           VALUES ('current', ?, NOW())
           ON DUPLICATE KEY UPDATE data = VALUES(data), updated_at = NOW()`,
          [jsonStr]
        );
      } else if (collectionName === 'adminAuth' && data && typeof data === 'object') {
        await p.query(
          `INSERT INTO admin_auth (id, username, password_hash, role, data, updated_at)
           VALUES ('default', ?, ?, ?, ?, NOW())
           ON DUPLICATE KEY UPDATE username = VALUES(username), password_hash = VALUES(password_hash), role = VALUES(role), data = VALUES(data), updated_at = NOW()`,
          [data.username || 'admin', data.password || data.passwordHash || '', data.role || 'Super Admin', JSON.stringify(data)]
        );
      } else if (collectionName === 'testimonials' && Array.isArray(data)) {
        for (const t of data) {
          if (!t || !t.id) continue;
          await p.query(
            `INSERT INTO testimonials (id, author, role, company, rating, content, data, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
             ON DUPLICATE KEY UPDATE author = VALUES(author), role = VALUES(role), company = VALUES(company), rating = VALUES(rating), content = VALUES(content), data = VALUES(data), updated_at = NOW()`,
            [t.id, t.author || '', t.role || '', t.company || '', parseInt(t.rating || 5, 10), t.content || '', JSON.stringify(t)]
          );
        }
      }
    } catch (syncErr) {
      logger.warn(`MySQL relational table sync warning for ${collectionName}:`, syncErr.message || syncErr);
    }
  } catch (err) {
    logger.error(`Error saving collection "${collectionName}" to MySQL:`, err.message || err);
  }
}

/**
 * Migrates an entire object of collections into MySQL
 */
export async function saveAllCollectionsToMysql(allData) {
  if (!allData || typeof allData !== 'object' || !isConnected) return;
  for (const [key, val] of Object.entries(allData)) {
    await saveCollectionToMysql(key, val);
  }
}

export default {
  getPool,
  isMysqlActive,
  initMysqlSchema,
  loadAllCollectionsFromMysql,
  saveCollectionToMysql,
  saveAllCollectionsToMysql,
};
