import express from 'express';
import {
  addTransaction,
  getTransactions,
  deleteTransaction
} from '../controllers/TransactionController.js';

const router = express.Router();

// POST /api/transactions
router.post('/', addTransaction);

// GET /api/transactions
router.get('/', getTransactions);

// DELETE /api/transactions/:id
router.delete('/:id', deleteTransaction);

export default router;
