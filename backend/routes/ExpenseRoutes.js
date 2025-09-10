// In backend/routes/ExpenseRoutes.js

import express from 'express';
import {
  addExpense,
  getExpenses,
  deleteExpense
} from '../controllers/ExpenseController.js';
// 1. Import your authentication middleware
import protect from '../middleware/auth.js';

const router = express.Router();

// 2. Add 'protect' to the routes that should require a login
router.post('/', protect, addExpense);
router.get('/', protect, getExpenses);
router.delete('/:id', protect, deleteExpense);

export default router;