const { createExpense, getExpenseById, getExpensesByDateRange } = require('../models/expense');

exports.createExpense = async (req, res) => {
  try {
    const { date, vendor_id, amount, description, account_id } = req.body;
 
    if (!date || !vendor_id || !amount || !account_id) {
      return res.status(400).json({ 
        message: 'Missing required fields: date, vendor_id, amount, account_id' 
      });
    }
 
    const newExpense = await createExpense({
      date,
      vendorId: vendor_id,
      amount,
      description: description || '',
      accountId: account_id
    });
 
    res.status(201).json({
      success: true,
      data: newExpense
    });
  } catch (error) {
    console.error('Create expense error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

exports.getExpense = async (req, res) => {
  try {
    const expenseId = parseInt(req.params.id, 10);
    if (isNaN(expenseId)) {
      return res.status(400).json({ message: 'Invalid expense ID' });
    }

    const expense = await getExpenseById(expenseId);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json(expense);
  } catch (error) {
    console.error('Get expense error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getExpensesByDateRange = async (req, res) => {
  try {
    const { start, end } = req.query; 
    if (!start || !end) {
      return res.status(400).json({ 
        message: 'Both start and end date parameters are required' 
      });
    }
 
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(start) || !dateRegex.test(end)) {
      return res.status(400).json({ 
        message: 'Dates must be in YYYY-MM-DD format' 
      });
    }
 
    if (new Date(start) > new Date(end)) {
      return res.status(400).json({ 
        message: 'Start date must be before or equal to end date' 
      });
    }

    const expenses = await getExpensesByDateRange(start, end);
    
    res.json({
      success: true,
      count: expenses.length,
      data: expenses
    });
  } catch (error) {
    console.error('Get expenses by date range error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
};
