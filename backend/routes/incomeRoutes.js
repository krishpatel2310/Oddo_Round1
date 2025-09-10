// In backend/routes/incomeRoutes.js

import express from 'express';
import {
  createIncome,
  getAllIncomes,
  deleteIncome,
} from '../controllers/IncomeController.js';
import protect from '../middleware/auth.js'; 

const router = express.Router();

// 👇 2. Add 'protect' to the routes
router.post('/', protect, createIncome);
router.get('/', protect, getAllIncomes);
router.delete('/:id', protect, deleteIncome);

export default router;