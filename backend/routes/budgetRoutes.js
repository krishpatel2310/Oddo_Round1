import express from 'express';
import {
  createOrUpdateBudget,
  getBudgets,
  getBudgetById,
  deleteBudget,
  getBudgetAnalytics,
  updateBudgetSpending,
  getSpendingTrends
} from '../controllers/BudgetController.js';
import protect from '../Middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   POST /api/budgets
// @desc    Create or update budget
router.post('/', createOrUpdateBudget);

// @route   GET /api/budgets
// @desc    Get all budgets for user
router.get('/', getBudgets);

// @route   GET /api/budgets/analytics
// @desc    Get budget analytics and charts data
router.get('/analytics', getBudgetAnalytics);

// @route   GET /api/budgets/spending-trends
// @desc    Get spending trends data
router.get('/spending-trends', getSpendingTrends);

// @route   PUT /api/budgets/update-spending
// @desc    Update budget spending (internal use)
router.put('/update-spending', updateBudgetSpending);

// @route   GET /api/budgets/:id
// @desc    Get budget by ID
router.get('/:id', getBudgetById);

// @route   DELETE /api/budgets/:id
// @desc    Delete budget
router.delete('/:id', deleteBudget);

export default router;