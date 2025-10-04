import express from 'express';
import {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getTransactionSummary,
  getTransactionsByCategory
} from '../controllers/TransactionController.js';
import auth from '../Middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(auth);

// @route   POST /api/transactions
// @desc    Create new transaction (income or expense)
router.post('/', createTransaction);

// @route   GET /api/transactions
// @desc    Get all transactions for user with optional filters
// @query   ?type=income|expense&limit=10&page=1
router.get('/', getTransactions);

// @route   GET /api/transactions/summary
// @desc    Get transaction summary for dashboard
router.get('/summary', getTransactionSummary);

// @route   GET /api/transactions/analytics/category
// @desc    Get transactions grouped by category for analytics
router.get('/analytics/category', getTransactionsByCategory);

// @route   GET /api/transactions/:id
// @desc    Get single transaction by ID
router.get('/:id', getTransactionById);

// @route   PUT /api/transactions/:id
// @desc    Update transaction
router.put('/:id', updateTransaction);

router.delete('/:id', deleteTransaction);

export default router;
