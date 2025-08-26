const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/BudgetController');

// Create a new budget
router.post('/', budgetController.createBudget);

// Get all budgets
router.get('/', budgetController.getAllBudgets);

// Delete a budget by ID
router.delete('/:id', budgetController.deleteBudget);

module.exports = router;
