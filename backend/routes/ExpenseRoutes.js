const express = require('express');
const router = express.Router();
const {
  addExpense,
  getExpenses,
  deleteExpense
} = require('../controllers/ExpenseController');

// POST /api/expenses
router.post('/', addExpense);

// GET /api/expenses
router.get('/', getExpenses);

// DELETE /api/expenses/:id
router.delete('/:id', deleteExpense);

module.exports = router;
