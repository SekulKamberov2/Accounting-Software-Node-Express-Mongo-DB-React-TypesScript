const { createBankTransaction, importFromCSV } = require('../models/bankTransaction');
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