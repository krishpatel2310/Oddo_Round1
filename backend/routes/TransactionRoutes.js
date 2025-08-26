const express = require('express');
const router = express.Router();
const {
  addTransaction,
  getTransactions,
  deleteTransaction
} = require('../controllers/TransactionController');

// POST /api/transactions
router.post('/', addTransaction);

// GET /api/transactions
router.get('/', getTransactions);

// DELETE /api/transactions/:id
router.delete('/:id', deleteTransaction);

module.exports = router;
