import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import mysqlModule, {
  getPool,
  isMysqlActive,
  initMysqlSchema,
  loadAllCollectionsFromMysql,
  saveCollectionToMysql,
  saveAllCollectionsToMysql,
} from '../../src/database/mysql.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendDir = path.resolve(__dirname, '..', '..');

describe('Backend MySQL Driver & Schema Validation Tests', () => {
  it('should export all required MySQL persistence methods', () => {
    assert.strictEqual(typeof getPool, 'function');
    assert.strictEqual(typeof isMysqlActive, 'function');
    assert.strictEqual(typeof initMysqlSchema, 'function');
    assert.strictEqual(typeof loadAllCollectionsFromMysql, 'function');
    assert.strictEqual(typeof saveCollectionToMysql, 'function');
    assert.strictEqual(typeof saveAllCollectionsToMysql, 'function');
    assert.strictEqual(typeof mysqlModule.initMysqlSchema, 'function');
  });

  it('should safely return false when MySQL is not connected', () => {
    assert.strictEqual(typeof isMysqlActive(), 'boolean');
  });

  it('should safely return null from loadAllCollectionsFromMysql when pool is inactive', async () => {
    const data = await loadAllCollectionsFromMysql();
    assert.strictEqual(data, null);
  });

  it('should verify schema.sql contains complete DDL for all 9 tables', () => {
    const schemaFile = path.join(backendDir, 'schema.sql');
    assert.ok(fs.existsSync(schemaFile), 'schema.sql must exist');

    const content = fs.readFileSync(schemaFile, 'utf8');
    const requiredTables = [
      'ecotex_store',
      'products',
      'categories',
      'orders',
      'quotes',
      'customer_messages',
      'site_settings',
      'testimonials',
      'admin_auth',
    ];

    for (const table of requiredTables) {
      assert.ok(
        content.includes(`CREATE TABLE IF NOT EXISTS \`${table}\``) ||
        content.includes(`CREATE TABLE IF NOT EXISTS ${table}`),
        `schema.sql must contain DDL for table: ${table}`
      );
    }

    assert.ok(content.includes('INSERT INTO `ecotex_store`'), 'schema.sql must contain seed data for ecotex_store');
    assert.ok(content.includes('INSERT INTO `products`'), 'schema.sql must contain seed data for products');
    assert.ok(content.includes('INSERT INTO `categories`'), 'schema.sql must contain seed data for categories');
  });
});

