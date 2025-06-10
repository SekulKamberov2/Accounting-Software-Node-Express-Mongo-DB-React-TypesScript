const sql = require('mssql');
const { config } = require('../config');
const csv = require('csv-parser');
const fs = require('fs');

async function createBankTransaction({ date, description, amount, accountId }) {
  try {
    const pool = await sql.connect(config);
    
    const result = await pool.request()
      .input('date', sql.Date, date)
      .input('description', sql.NVarChar, description)
      .input('amount', sql.Float, amount)
      .input('accountId', sql.Int, accountId)
      .query(`
        INSERT INTO BankTransactions (Date, Description, Amount, AccountId)
        VALUES (@date, @description, @amount, @accountId);
        SELECT SCOPE_IDENTITY() AS id;
      `);

    pool.close();
    
    return {
      id: parseInt(result.recordset[0].id),
      date,
      description,
      amount,
      accountId
    };
  } catch (error) {
    throw error;
  }
}

async function importFromCSV(filePath, accountId) {
  return new Promise((resolve, reject) => {
    const transactions = [];
    const errors = [];
    let rowCount = 0;

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        rowCount++;
        try {
          // validate and transform CSV data
          if (!row.Date || !row.Description || !row.Amount) {
            errors.push(`Row ${rowCount}: Missing required fields`);
            return;
          }

          const transaction = {
            date: new Date(row.Date),
            description: row.Description,
            amount: parseFloat(row.Amount),
            accountId: accountId
          };

          if (isNaN(transaction.amount)) {
            errors.push(`Row ${rowCount}: Invalid amount`);
            return;
          }

          if (isNaN(transaction.date.getTime())) {
            errors.push(`Row ${rowCount}: Invalid date format`);
            return;
          }

          transactions.push(transaction);
        } catch (error) {
          errors.push(`Row ${rowCount}: ${error.message}`);
        }
      })
      .on('end', () => {
        resolve({ transactions, errors });
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

module.exports = { createBankTransaction, importFromCSV };
