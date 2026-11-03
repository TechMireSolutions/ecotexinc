import { getDb, updateDb } from '../database/db.js';
import logger from '../utils/logger.js';

export async function getSettings(req, res) {
  try {
    const db = getDb();
    res.json(db.settings || {});
  } catch (err) {
    logger.error('Error fetching settings:', err);
    res.status(500).json({ error: 'Failed to retrieve site settings' });
  }
}

function deepMerge(target, source) {
  if (!source || typeof source !== 'object' || Array.isArray(source)) {
    return source;
  }
  const result = { ...(target || {}) };
  for (const key of Object.keys(source)) {
    const srcVal = source[key];
    const tgtVal = result[key];
    if (
      srcVal &&
      typeof srcVal === 'object' &&
      !Array.isArray(srcVal) &&
      tgtVal &&
      typeof tgtVal === 'object' &&
      !Array.isArray(tgtVal)
    ) {
      result[key] = deepMerge(tgtVal, srcVal);
    } else {
      result[key] = srcVal;
    }
  }
  return result;
}

export async function updateSettings(req, res) {
  try {
    const updates = req.body || {};
    let updatedSettings = null;

    await updateDb((db) => {
      const current = db.settings || {};
      const merged = deepMerge(current, updates);
      merged.updatedAt = new Date().toISOString();
      db.settings = merged;
      updatedSettings = db.settings;
      return db;
    });

    res.json(updatedSettings);
  } catch (err) {
    logger.error('Error updating settings:', err);
    res.status(500).json({ error: 'Failed to update site settings' });
  }
}

export default {
  getSettings,
  updateSettings,
};
