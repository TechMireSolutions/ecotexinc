import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootBackendDir = path.resolve(__dirname, '..', '..');

// Load root .env if present, followed by backend/.env (allowing override)
const rootEnvPath = path.resolve(rootBackendDir, '..', '.env');
const backendEnvPath = path.join(rootBackendDir, '.env');

if (fs.existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath });
}
if (fs.existsSync(backendEnvPath)) {
  dotenv.config({ path: backendEnvPath, override: true });
}

export const config = Object.freeze({
  env: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  port: parseInt(process.env.PORT || '3001', 10),
  host: process.env.HOST || '0.0.0.0',

  // MySQL Database Configuration
  mysql: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || '',
    ssl: process.env.DB_SSL === 'true',
  },

  // PostgreSQL Configuration (Alternative cloud provider)
  databaseUrl: process.env.DATABASE_URL || '',
  
  jwt: {
    secret: process.env.JWT_SECRET || 'ecotex_default_secret_key_change_me_in_prod',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MINUTES || '15', 10) * 60 * 1000,
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '1000', 10),
    authMaxRequests: parseInt(process.env.AUTH_RATE_LIMIT_MAX_REQUESTS || '20', 10),
  },

  paths: {
    root: rootBackendDir,
    dbFile: process.env.VERCEL ? path.join('/tmp', 'db.json') : path.join(rootBackendDir, 'db.json'),
    dbBackup: process.env.VERCEL ? path.join('/tmp', 'db.backup.json') : path.join(rootBackendDir, 'db.backup.json'),
    uploadsDir: process.env.VERCEL ? path.join('/tmp', process.env.UPLOAD_DIRECTORY || 'uploads') : path.join(rootBackendDir, process.env.UPLOAD_DIRECTORY || 'uploads'),
    frontendDist: [
      path.join(rootBackendDir, 'dist'),
      path.join(rootBackendDir, 'public'),
      path.resolve(rootBackendDir, '..', 'frontend', 'dist'),
      path.resolve(rootBackendDir, '..', 'ecotex-inc-frontend', 'dist'),
      path.resolve(rootBackendDir, '..', 'dist'),
    ].find((p) => fs.existsSync(p) && fs.existsSync(path.join(p, 'index.html')))
      || path.join(rootBackendDir, 'dist'),
    rootDist: path.resolve(rootBackendDir, '..', 'dist'),
  },

  upload: {
    maxSizeMb: parseInt(process.env.MAX_UPLOAD_SIZE_MB || '50', 10),
    maxSizeBytes: parseInt(process.env.MAX_UPLOAD_SIZE_MB || '50', 10) * 1024 * 1024,
    allowedMimeTypes: [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/webp',
      'image/svg+xml',
      'image/gif',
      'application/pdf'
    ]
  }
});

export default config;
