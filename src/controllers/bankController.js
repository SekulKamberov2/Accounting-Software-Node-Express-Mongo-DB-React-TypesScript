const { createBankTransaction, importFromCSV, getBankTransactions, getBankTransactionById  } = require('../models/bankTransaction');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

exports.importBankTransactions = async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const accountId = parseInt(req.body.accountId, 10);
    if (isNaN(accountId)) {
      return res.status(400).json({ message: 'Valid accountId is required' });
    }

    const file = req.files.file;
    const fileExt = path.extname(file.name).toLowerCase();
    if (fileExt !== '.csv') {
      return res.status(400).json({ message: 'Only CSV files are allowed' });
    }

    //create unique filename
    const fileName = `${uuidv4()}${fileExt}`;
    const uploadPath = path.join(__dirname, '../uploads', fileName);

    //save file temporarily
    await file.mv(uploadPath);

    // process CSV file
    const { transactions, errors } = await importFromCSV(uploadPath, accountId);

    //insert valid transactions
    const insertedTransactions = [];
    for (const transaction of transactions) {
      try {
        const result = await createBankTransaction(transaction);
        insertedTransactions.push(result);
      } catch (error) {
        errors.push(`Failed to insert transaction: ${transaction.description} - ${error.message}`);
      }
    }

    //delete the temp file
    fs.unlinkSync(uploadPath);

    res.json({
      success: true,
      importedCount: insertedTransactions.length,
      errorCount: errors.length,
      errors,
      data: insertedTransactions
    });

  } catch (error) {
    console.error('Import bank transactions error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

exports.getBankTransactions = async (req, res) => {
  try { 
    const filters = {
      accountId: req.query.account_id ? parseInt(req.query.account_id, 10) : undefined,
      startDate: req.query.start_date,
      endDate: req.query.end_date,
      minAmount: req.query.min_amount ? parseFloat(req.query.min_amount) : undefined,
      maxAmount: req.query.max_amount ? parseFloat(req.query.max_amount) : undefined,
      search: req.query.search
    };
 
    if (filters.accountId && isNaN(filters.accountId)) {
      return res.status(400).json({ message: 'Invalid account_id' });
    }
 
    if (filters.startDate && isNaN(new Date(filters.startDate).getTime())) {
      return res.status(400).json({ message: 'Invalid start_date format (use YYYY-MM-DD)' });
    }

    if (filters.endDate && isNaN(new Date(filters.endDate).getTime())) {
      return res.status(400).json({ message: 'Invalid end_date format (use YYYY-MM-DD)' });
    }
 
    if (filters.minAmount && isNaN(filters.minAmount)) {
      return res.status(400).json({ message: 'Invalid min_amount' });
    }

    if (filters.maxAmount && isNaN(filters.maxAmount)) {
      return res.status(400).json({ message: 'Invalid max_amount' });
    }
 
    const transactions = await getBankTransactions(filters);
 
    res.json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (error) {
    console.error('Get bank transactions error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

exports.getBankTransaction = async (req, res) => {
  try {
    const transactionId = parseInt(req.params.id, 10);
    if (isNaN(transactionId)) {
      return res.status(400).json({ message: 'Invalid transaction ID' });
    }

    const transaction = await getBankTransactionById(transactionId);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    console.error('Get bank transaction error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};