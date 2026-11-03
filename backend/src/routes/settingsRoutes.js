import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController.js';

import { requireAuth } from '../middleware/authMiddleware.js';

export const settingsRouter = express.Router();

settingsRouter.get('/', getSettings);
settingsRouter.put('/', requireAuth, updateSettings);

export default settingsRouter;
