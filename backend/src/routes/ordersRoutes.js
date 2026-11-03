import express from 'express';
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  updateOrder,
  deleteOrder,
} from '../controllers/ordersController.js';

import { requireAuth } from '../middleware/authMiddleware.js';

export const ordersRouter = express.Router();

ordersRouter.get('/', requireAuth, getAllOrders);
ordersRouter.get('/:id', getOrderById);
ordersRouter.post('/', createOrder);
ordersRouter.put('/:id', requireAuth, updateOrder);
ordersRouter.patch('/:id/status', requireAuth, updateOrderStatus);
ordersRouter.delete('/:id', requireAuth, deleteOrder);

export default ordersRouter;
