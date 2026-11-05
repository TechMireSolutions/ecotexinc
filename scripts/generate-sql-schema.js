import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const dbPath = path.join(rootDir, 'backend', 'db.json');
const outSqlPath = path.join(rootDir, 'backend', 'schema.sql');

const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

function escapeSql(str) {
  if (str === null || str === undefined) return 'NULL';
  return `'` + String(str).replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, (char) => {
    switch (char) {
      case '\0': return '\\0';
      case '\x08': return '\\b';
      case '\x09': return '\\t';
      case '\x1a': return '\\z';
      case '\n': return '\\n';
      case '\r': return '\\r';
      case '"':
      case "'":
      case '\\':
      case '%': return '\\' + char;
      default: return char;
    }
  }) + `'`;
}

let sql = `-- ========================================================
-- Ecotex Inc. - cPanel MySQL Production Schema & Migration
-- Database: mkbrothe_ecotexinc
-- Domain: ecotexinc.com
-- ========================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 1. Primary Unified Collection Store
CREATE TABLE IF NOT EXISTS \`ecotex_store\` (
  \`collection_name\` VARCHAR(64) NOT NULL PRIMARY KEY,
  \`data\` LONGTEXT NOT NULL,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Products Table
CREATE TABLE IF NOT EXISTS \`products\` (
  \`id\` VARCHAR(128) NOT NULL PRIMARY KEY,
  \`name\` VARCHAR(255) NULL,
  \`category\` VARCHAR(128) NULL,
  \`in_stock\` TINYINT(1) DEFAULT 1,
  \`data\` LONGTEXT NOT NULL,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX \`idx_prod_category\` (\`category\`),
  INDEX \`idx_prod_stock\` (\`in_stock\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Categories Table
CREATE TABLE IF NOT EXISTS \`categories\` (
  \`id\` VARCHAR(128) NOT NULL PRIMARY KEY,
  \`name\` VARCHAR(255) NULL,
  \`slug\` VARCHAR(128) NULL,
  \`data\` LONGTEXT NOT NULL,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Commercial Orders Table
CREATE TABLE IF NOT EXISTS \`orders\` (
  \`id\` VARCHAR(128) NOT NULL PRIMARY KEY,
  \`order_number\` VARCHAR(128) NULL,
  \`customer_name\` VARCHAR(255) NULL,
  \`customer_email\` VARCHAR(255) NULL,
  \`status\` VARCHAR(64) DEFAULT 'Pending',
  \`total_amount\` DECIMAL(12, 2) DEFAULT 0.00,
  \`data\` LONGTEXT NOT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX \`idx_order_status\` (\`status\`),
  INDEX \`idx_order_created\` (\`created_at\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Custom Quotes / RFQs Table
CREATE TABLE IF NOT EXISTS \`quotes\` (
  \`id\` VARCHAR(128) NOT NULL PRIMARY KEY,
  \`contact_name\` VARCHAR(255) NULL,
  \`email\` VARCHAR(255) NULL,
  \`status\` VARCHAR(64) DEFAULT 'New',
  \`data\` LONGTEXT NOT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX \`idx_quote_status\` (\`status\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Customer Messages / WhatsApp CRM Table
CREATE TABLE IF NOT EXISTS \`customer_messages\` (
  \`id\` VARCHAR(128) NOT NULL PRIMARY KEY,
  \`customer_name\` VARCHAR(255) NULL,
  \`email\` VARCHAR(255) NULL,
  \`phone\` VARCHAR(64) NULL,
  \`status\` VARCHAR(64) DEFAULT 'New',
  \`data\` LONGTEXT NOT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Site Settings / Dynamic CMS Configuration Table
CREATE TABLE IF NOT EXISTS \`site_settings\` (
  \`id\` VARCHAR(64) NOT NULL PRIMARY KEY,
  \`data\` LONGTEXT NOT NULL,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Testimonials Table
CREATE TABLE IF NOT EXISTS \`testimonials\` (
  \`id\` VARCHAR(128) NOT NULL PRIMARY KEY,
  \`author\` VARCHAR(255) NULL,
  \`company\` VARCHAR(255) NULL,
  \`data\` LONGTEXT NOT NULL,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Administrator Authentication Credentials Table
CREATE TABLE IF NOT EXISTS \`admin_auth\` (
  \`id\` VARCHAR(64) NOT NULL PRIMARY KEY,
  \`username\` VARCHAR(128) NULL,
  \`email\` VARCHAR(255) NULL,
  \`data\` LONGTEXT NOT NULL,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================================
-- INITIAL SEED DATA MIGRATION (Imported from Current db.json)
-- ========================================================

`;

// 1. Seed ecotex_store
for (const [colName, val] of Object.entries(db)) {
  const jsonStr = JSON.stringify(val);
  sql += `INSERT INTO \`ecotex_store\` (\`collection_name\`, \`data\`, \`updated_at\`)
VALUES (${escapeSql(colName)}, ${escapeSql(jsonStr)}, NOW())
ON DUPLICATE KEY UPDATE \`data\` = VALUES(\`data\`), \`updated_at\` = NOW();\n\n`;
}

// 2. Seed products
if (Array.isArray(db.products)) {
  for (const prod of db.products) {
    if (!prod || !prod.id) continue;
    sql += `INSERT INTO \`products\` (\`id\`, \`name\`, \`category\`, \`in_stock\`, \`data\`, \`updated_at\`)
VALUES (${escapeSql(prod.id)}, ${escapeSql(prod.name || '')}, ${escapeSql(prod.category || '')}, ${prod.inStock !== false ? 1 : 0}, ${escapeSql(JSON.stringify(prod))}, NOW())
ON DUPLICATE KEY UPDATE \`name\` = VALUES(\`name\`), \`category\` = VALUES(\`category\`), \`in_stock\` = VALUES(\`in_stock\`), \`data\` = VALUES(\`data\`), \`updated_at\` = NOW();\n`;
  }
  sql += `\n`;
}

// 3. Seed categories
if (Array.isArray(db.categories)) {
  for (const cat of db.categories) {
    if (!cat || !cat.id) continue;
    sql += `INSERT INTO \`categories\` (\`id\`, \`name\`, \`slug\`, \`data\`, \`updated_at\`)
VALUES (${escapeSql(cat.id)}, ${escapeSql(cat.label || cat.name || '')}, ${escapeSql(cat.id)}, ${escapeSql(JSON.stringify(cat))}, NOW())
ON DUPLICATE KEY UPDATE \`name\` = VALUES(\`name\`), \`slug\` = VALUES(\`slug\`), \`data\` = VALUES(\`data\`), \`updated_at\` = NOW();\n`;
  }
  sql += `\n`;
}

// 4. Seed site_settings
if (db.settings) {
  sql += `INSERT INTO \`site_settings\` (\`id\`, \`data\`, \`updated_at\`)
VALUES ('current', ${escapeSql(JSON.stringify(db.settings))}, NOW())
ON DUPLICATE KEY UPDATE \`data\` = VALUES(\`data\`), \`updated_at\` = NOW();\n\n`;
}

// 5. Seed admin_auth
if (db.adminAuth) {
  sql += `INSERT INTO \`admin_auth\` (\`id\`, \`username\`, \`email\`, \`data\`, \`updated_at\`)
VALUES ('primary', ${escapeSql(db.adminAuth.username || 'admin')}, ${escapeSql(db.adminAuth.email || 'admin@ecotexinc.com')}, ${escapeSql(JSON.stringify(db.adminAuth))}, NOW())
ON DUPLICATE KEY UPDATE \`username\` = VALUES(\`username\`), \`email\` = VALUES(\`email\`), \`data\` = VALUES(\`data\`), \`updated_at\` = NOW();\n\n`;
}

// 6. Seed testimonials
if (Array.isArray(db.testimonials)) {
  for (const t of db.testimonials) {
    if (!t || !t.id) continue;
    sql += `INSERT INTO \`testimonials\` (\`id\`, \`author\`, \`company\`, \`data\`, \`updated_at\`)
VALUES (${escapeSql(t.id)}, ${escapeSql(t.author || t.name || '')}, ${escapeSql(t.company || '')}, ${escapeSql(JSON.stringify(t))}, NOW())
ON DUPLICATE KEY UPDATE \`author\` = VALUES(\`author\`), \`company\` = VALUES(\`company\`), \`data\` = VALUES(\`data\`), \`updated_at\` = NOW();\n`;
  }
  sql += `\n`;
}

sql += `SET FOREIGN_KEY_CHECKS = 1;\n-- Migration Complete\n`;

fs.writeFileSync(outSqlPath, sql, 'utf8');
console.log(`✅ MySQL schema & migration successfully generated at: ${outSqlPath} (${(sql.length / 1024).toFixed(1)} KB)`);

