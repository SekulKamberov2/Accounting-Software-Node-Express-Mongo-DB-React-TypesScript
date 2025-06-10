const sql = require('mssql');
const { config } = require('../config');

exports.recordPayment = async ({ invoice_id, amount, date, method }) => {
  const pool = await sql.connect(config);

  await pool.request()
    .input('InvoiceId', sql.Int, invoice_id)
    .input('Amount', sql.Float, amount)
    .input('Date', sql.Date, date)
    .input('Method', sql.NVarChar, method)
    .query(`
      INSERT INTO Payments (InvoiceId, Amount, Date, Method)
      VALUES (@InvoiceId, @Amount, @Date, @Method)
    `);
};
