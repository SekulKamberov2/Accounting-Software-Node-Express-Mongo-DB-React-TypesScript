const sql = require('mssql');
const { config } = require('../config');

async function createExpense({ date, vendorId, amount, description, accountId }) {
  try {
    const pool = await sql.connect(config);
    
    const result = await pool.request()
      .input('date', sql.Date, date)
      .input('vendorId', sql.Int, vendorId)
      .input('amount', sql.Float, amount)
      .input('description', sql.NVarChar, description)
      .input('accountId', sql.Int, accountId)
      .query(`
        INSERT INTO Expenses (Date, VendorId, Amount, Description, AccountId)
        VALUES (@date, @vendorId, @amount, @description, @accountId);
        SELECT SCOPE_IDENTITY() AS id;
      `);

    pool.close();
    
    return {
      id: parseInt(result.recordset[0].id),
      date,
      vendorId,
      amount,
      description,
      accountId
    };
  } catch (error) {
    throw error;
  }
}

async function getExpenseById(id) {
  try {
    const pool = await sql.connect(config);
    
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Expenses WHERE Id = @id');
    
    pool.close();
    
    return result.recordset[0] || null;
  } catch (error) {
    throw error;
  }
}

async function getExpensesByDateRange(startDate, endDate) {
  try {
    const pool = await sql.connect(config);
    
    const result = await pool.request()
      .input('startDate', sql.Date, startDate)
      .input('endDate', sql.Date, endDate)
      .query(`
        SELECT e.Id, e.Date, e.Amount, e.Description, 
               e.AccountId, a.Name AS AccountName, a.Code AS AccountCode,
               e.VendorId, v.Name AS VendorName
        FROM Expenses e
        LEFT JOIN Accounts a ON e.AccountId = a.Id
        LEFT JOIN Vendors v ON e.VendorId = v.Id
        WHERE e.Date BETWEEN @startDate AND @endDate
        ORDER BY e.Date DESC
      `);
    
    pool.close();
    
    return result.recordset;
  } catch (error) {
    throw error;
  }
}

module.exports = { createExpense, getExpenseById, getExpensesByDateRange };