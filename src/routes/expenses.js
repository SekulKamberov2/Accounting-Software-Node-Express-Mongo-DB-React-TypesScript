const express = require('express');
const router = express.Router();
const { createExpense, getExpense } = require('../controllers/expenseController');
 
router.post('/', createExpense); 
router.get('/:id', getExpense);

module.exports = router;
