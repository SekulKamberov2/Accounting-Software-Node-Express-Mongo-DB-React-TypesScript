const express = require('express');
const router = express.Router();
const { createExpense, getExpense, getExpensesByDateRange  } = require('../controllers/expenseController');
 
router.post('/', createExpense); 
router.get('/:id', getExpense);
router.get('/', getExpensesByDateRange);

module.exports = router;
