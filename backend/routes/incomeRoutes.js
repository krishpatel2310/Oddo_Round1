const express = require('express');
const router = express.Router();
const incomeController = require('../controllers/IncomeController');

router.post('/', incomeController.createIncome);
router.get('/', incomeController.getAllIncomes);
router.delete('/:id', incomeController.deleteIncome);

module.exports = router;
