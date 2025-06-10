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

async function fetchBalanceSheet(date) {
  const pool = await sql.connect(config);
   
  const query = `
    SELECT 
      a.Id, a.Name, a.Type, a.Code,
      SUM(CASE WHEN jue.Credit > 0 THEN jue.Credit ELSE 0 END) as TotalCredits,
      SUM(CASE WHEN jue.Debit > 0 THEN jue.Debit ELSE 0 END) as TotalDebits
    FROM Accounts a
    LEFT JOIN JournalEntryLines jue ON a.Id = jue.AccountId
    LEFT JOIN JournalEntries je ON jue.JournalEntryId = je.Id
    WHERE je.Date <= @date -- only up to the specified date
    GROUP BY a.Id, a.Name, a.Type, a.Code
  `;
  
  const result = await pool.request()
    .input('date', sql.Date, date)
    .query(query);
  
  pool.close();
 
  const accounts = result.recordset.map(acc => {
    let balance = 0;
    switch (acc.Type.toLowerCase()) {
      case 'asset':
      case 'expense':
        balance = acc.TotalDebits - acc.TotalCredits;
        break;
      case 'liability':
      case 'revenue':
      case 'equity':
        balance = acc.TotalCredits - acc.TotalDebits;
        break;
      default:
        balance = 0;
    }

    return {
      id: acc.Id,
      name: acc.Name,
      type: acc.Type,
      code: acc.Code,
      balance: balance
    };
  });
 
  const summary = {
    assets: accounts.filter(a => a.type.toLowerCase() === 'asset'),
    liabilities: accounts.filter(a => a.type.toLowerCase() === 'liability'),
    equity: accounts.filter(a => a.type.toLowerCase() === 'equity')
  };

  return summary;
}

module.exports = {
  fetchProfitAndLoss,
  fetchBalanceSheet
};
