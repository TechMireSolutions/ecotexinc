import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  toggleStock,
  deleteProduct,
} from '../controllers/productsController.js';

import { requireAuth } from '../middleware/authMiddleware.js';

export const productsRouter = express.Router();

productsRouter.get('/', getAllProducts);
productsRouter.get('/:id', getProductById);
productsRouter.post('/', requireAuth, createProduct);
productsRouter.put('/:id', requireAuth, updateProduct);
productsRouter.patch('/:id/toggle-stock', requireAuth, toggleStock);
productsRouter.delete('/:id', requireAuth, deleteProduct);

export default productsRouter;
