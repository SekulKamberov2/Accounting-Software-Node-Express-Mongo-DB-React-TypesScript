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

exports.getAllPayments = async () => {
  const pool = await sql.connect(config);
  const result = await pool.request().query(`
    SELECT Id, InvoiceId, Amount, Date, Method
    FROM Payments
    ORDER BY Date DESC
  `);
  return result.recordset;
};

exports.updatePayment = async ({ id, invoice_id, amount, date, method }) => {
  try {
    console.log(id, invoice_id, amount, date, method)
    const pool = await sql.connect(config);
    await pool.request()
      .input('Id', sql.Int, id)
      .input('InvoiceId', sql.Int, invoice_id)
      .input('Amount', sql.Float, amount)
      .input('Date', sql.Date, date)
      .input('Method', sql.NVarChar, method)
      .query(`
        UPDATE Payments
        SET 
          InvoiceId = @InvoiceId,
          Amount = @Amount,
          Date = @Date,
          Method = @Method
        WHERE Id = @Id
      `);
  } catch (error) {
    console.error('Error updating payment:', error);
    throw new Error('Failed to update payment');
  }
};

exports.deletePayment = async (id) => {
  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input('Id', sql.Int, id)
      .query(`DELETE FROM Payments WHERE Id = @Id`);
  } catch (error) {
    console.error('Error deleting payment:', error);
    throw new Error('Failed to delete payment');
  }
};
