import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const dbPath = path.join(rootDir, 'backend', 'db.json');
let dbData = {};
try {
  dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
} catch (e) {
  console.error('Could not read db.json:', e);
}

function escapeSql(str) {
  if (str === null || str === undefined) return "''";
  return "'" + String(str).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '\\r') + "'";
}

const sql = `-- ==============================================================================
-- ECOTEX INC. - Complete Production MySQL Database Schema & Initial Data
-- Target Database: \`mkbrothe_ecotexinc\`
-- Compatible with: MySQL 5.7 / 8.0 / 8.4 / MariaDB (cPanel / phpMyAdmin)
-- Generated: ${new Date().toISOString()}
-- ==============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";

-- ------------------------------------------------------------------------------
-- 1. Unified Document Store (Primary JSON Store)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS \`ecotex_store\` (
  \`collection_name\` VARCHAR(64) NOT NULL,
  \`data\` LONGTEXT NOT NULL,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`collection_name\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 2. Products Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS \`products\` (
  \`id\` VARCHAR(128) NOT NULL,
  \`name\` VARCHAR(255) DEFAULT '',
  \`category\` VARCHAR(128) DEFAULT '',
  \`in_stock\` TINYINT(1) DEFAULT 1,
  \`price\` DECIMAL(10, 2) DEFAULT 0.00,
  \`stock_quantity\` INT DEFAULT 0,
  \`data\` LONGTEXT NOT NULL,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 3. Categories Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS \`categories\` (
  \`id\` VARCHAR(128) NOT NULL,
  \`name\` VARCHAR(255) DEFAULT '',
  \`slug\` VARCHAR(128) DEFAULT '',
  \`data\` LONGTEXT NOT NULL,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 4. Orders Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS \`orders\` (
  \`id\` VARCHAR(128) NOT NULL,
  \`order_number\` VARCHAR(128) DEFAULT '',
  \`customer_name\` VARCHAR(255) DEFAULT '',
  \`customer_email\` VARCHAR(255) DEFAULT '',
  \`status\` VARCHAR(64) DEFAULT 'Pending',
  \`total_amount\` DECIMAL(12, 2) DEFAULT 0.00,
  \`data\` LONGTEXT NOT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 5. RFQ / Quotes Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS \`quotes\` (
  \`id\` VARCHAR(128) NOT NULL,
  \`contact_name\` VARCHAR(255) DEFAULT '',
  \`email\` VARCHAR(255) DEFAULT '',
  \`status\` VARCHAR(64) DEFAULT 'New',
  \`data\` LONGTEXT NOT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 6. Customer Messages / Contact Inquiries Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS \`customer_messages\` (
  \`id\` VARCHAR(128) NOT NULL,
  \`customer_name\` VARCHAR(255) DEFAULT '',
  \`email\` VARCHAR(255) DEFAULT '',
  \`phone\` VARCHAR(64) DEFAULT '',
  \`status\` VARCHAR(64) DEFAULT 'unread',
  \`data\` LONGTEXT NOT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 7. Site Settings & CMS Content Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS \`site_settings\` (
  \`id\` VARCHAR(64) NOT NULL,
  \`data\` LONGTEXT NOT NULL,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 8. Admin Authentication Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS \`admin_auth\` (
  \`id\` VARCHAR(64) NOT NULL,
  \`username\` VARCHAR(255) NOT NULL,
  \`password_hash\` VARCHAR(255) NOT NULL,
  \`role\` VARCHAR(64) DEFAULT 'Super Admin',
  \`data\` LONGTEXT NOT NULL,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 9. Testimonials Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS \`testimonials\` (
  \`id\` VARCHAR(128) NOT NULL,
  \`author\` VARCHAR(255) DEFAULT '',
  \`role\` VARCHAR(255) DEFAULT '',
  \`company\` VARCHAR(255) DEFAULT '',
  \`rating\` INT DEFAULT 5,
  \`content\` TEXT,
  \`data\` LONGTEXT NOT NULL,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- INITIAL DATA SEEDING (FROM LATEST REAL DATA)
-- ------------------------------------------------------------------------------

-- Seed ecotex_store
${Object.entries(dbData)
  .map(([k, v]) => `INSERT INTO \`ecotex_store\` (\`collection_name\`, \`data\`, \`updated_at\`) VALUES (${escapeSql(k)}, ${escapeSql(JSON.stringify(v))}, NOW()) ON DUPLICATE KEY UPDATE \`data\` = VALUES(\`data\`), \`updated_at\` = NOW();`)
  .join('\n')}

-- Seed site_settings
${dbData.settings ? `INSERT INTO \`site_settings\` (\`id\`, \`data\`, \`updated_at\`) VALUES ('current', ${escapeSql(JSON.stringify(dbData.settings))}, NOW()) ON DUPLICATE KEY UPDATE \`data\` = VALUES(\`data\`), \`updated_at\` = NOW();` : ''}

-- Seed admin_auth
${dbData.adminAuth ? `INSERT INTO \`admin_auth\` (\`id\`, \`username\`, \`password_hash\`, \`role\`, \`data\`, \`updated_at\`) VALUES ('default', ${escapeSql(dbData.adminAuth.username || 'admin')}, ${escapeSql(dbData.adminAuth.password || '')}, ${escapeSql(dbData.adminAuth.role || 'Super Admin')}, ${escapeSql(JSON.stringify(dbData.adminAuth))}, NOW()) ON DUPLICATE KEY UPDATE \`username\` = VALUES(\`username\`), \`password_hash\` = VALUES(\`password_hash\`), \`data\` = VALUES(\`data\`), \`updated_at\` = NOW();` : ''}

-- Seed products
${Array.isArray(dbData.products) ? dbData.products.map(p => `INSERT INTO \`products\` (\`id\`, \`name\`, \`category\`, \`in_stock\`, \`price\`, \`stock_quantity\`, \`data\`, \`updated_at\`) VALUES (${escapeSql(p.id)}, ${escapeSql(p.name)}, ${escapeSql(p.category)}, ${p.inStock !== false ? 1 : 0}, ${parseFloat(p.price || 0) || 0}, ${parseInt(p.stockQuantity || 0, 10) || 0}, ${escapeSql(JSON.stringify(p))}, NOW()) ON DUPLICATE KEY UPDATE \`name\` = VALUES(\`name\`), \`category\` = VALUES(\`category\`), \`in_stock\` = VALUES(\`in_stock\`), \`data\` = VALUES(\`data\`), \`updated_at\` = NOW();`).join('\n') : ''}

-- Seed categories
${Array.isArray(dbData.categories) ? dbData.categories.map(c => `INSERT INTO \`categories\` (\`id\`, \`name\`, \`slug\`, \`data\`, \`updated_at\`) VALUES (${escapeSql(c.id)}, ${escapeSql(c.label || c.name)}, ${escapeSql(c.id)}, ${escapeSql(JSON.stringify(c))}, NOW()) ON DUPLICATE KEY UPDATE \`name\` = VALUES(\`name\`), \`slug\` = VALUES(\`slug\`), \`data\` = VALUES(\`data\`), \`updated_at\` = NOW();`).join('\n') : ''}

SET FOREIGN_KEY_CHECKS = 1;
`;

const backendSqlPath = path.join(rootDir, 'backend', 'database_schema.sql');
fs.writeFileSync(backendSqlPath, sql, 'utf8');
console.log('✅ Generated backend/database_schema.sql successfully (' + (Buffer.byteLength(sql) / 1024).toFixed(1) + ' KB)');
