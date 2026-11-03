import express from 'express';
import {
  getAllQuotes,
  getQuoteById,
  createQuote,
  updateQuote,
  updateQuoteStatus,
  deleteQuote,
} from '../controllers/quotesController.js';
import { quotesLimiter } from '../middleware/rateLimiter.js';

import { requireAuth } from '../middleware/authMiddleware.js';

export const quotesRouter = express.Router();

quotesRouter.get('/', requireAuth, getAllQuotes);
quotesRouter.get('/:id', getQuoteById);
quotesRouter.post('/', quotesLimiter, createQuote);
quotesRouter.put('/:id', requireAuth, updateQuote);
quotesRouter.patch('/:id/status', requireAuth, updateQuoteStatus);
quotesRouter.delete('/:id', requireAuth, deleteQuote);

export default quotesRouter;
