import express from 'express';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoriesController.js';

import { requireAuth } from '../middleware/authMiddleware.js';

export const categoriesRouter = express.Router();

categoriesRouter.get('/', getAllCategories);
categoriesRouter.get('/:id', getCategoryById);
categoriesRouter.post('/', requireAuth, createCategory);
categoriesRouter.put('/:id', requireAuth, updateCategory);
categoriesRouter.delete('/:id', requireAuth, deleteCategory);

export default categoriesRouter;
