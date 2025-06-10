const sql = require('mssql');
const { config } = require('../config');

async function fetchProfitAndLoss(startDate, endDate) {
  const pool = await sql.connect(config);
 
  const revenueResult = await pool.request()
    .input('startDate', sql.Date, startDate)
    .input('endDate', sql.Date, endDate)
    .query(`
      SELECT SUM(jel.Credit) AS Revenue
      FROM JournalEntryLines jel
      JOIN JournalEntries je ON jel.JournalEntryId = je.Id
      JOIN Accounts a ON jel.AccountId = a.Id
      WHERE a.Type = 'Revenue' AND je.Date BETWEEN @startDate AND @endDate
    `);
 
  const expenseResult = await pool.request()
    .input('startDate', sql.Date, startDate)
    .input('endDate', sql.Date, endDate)
    .query(`
      SELECT SUM(jel.Debit) AS Expenses
      FROM JournalEntryLines jel
      JOIN JournalEntries je ON jel.JournalEntryId = je.Id
      JOIN Accounts a ON jel.AccountId = a.Id
      WHERE a.Type = 'Expense' AND je.Date BETWEEN @startDate AND @endDate
    `);

  const revenue = revenueResult.recordset[0].Revenue || 0;
  const expenses = expenseResult.recordset[0].Expenses || 0;
  const netProfit = revenue - expenses;

  return {
    revenue,
    expenses,
    netProfit
  };
}

module.exports = {
  fetchProfitAndLoss
};
