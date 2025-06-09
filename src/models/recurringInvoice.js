const sql = require('mssql');
const { config } = require('../config');

exports.createRecurringInvoice = async ({ customer_id, interval, start_date, items }) => {
  const pool = await sql.connect(config);

  try {
    await pool.transaction(async trx => { 
      const result = await trx.request()
        .input('CustomerId', sql.Int, customer_id)
        .input('Interval', sql.NVarChar(50), interval)
        .input('StartDate', sql.Date, start_date)
        .query(`
          INSERT INTO RecurringInvoices (CustomerId, Interval, StartDate)
          OUTPUT INSERTED.Id
          VALUES (@CustomerId, @Interval, @StartDate)
        `);

      const recurringInvoiceId = result.recordset[0].Id;
 
      for (const item of items) {
        await trx.request()
          .input('RecurringInvoiceId', sql.Int, recurringInvoiceId)
          .input('Description', sql.NVarChar(255), item.description)
          .input('Quantity', sql.Int, item.quantity)
          .input('UnitPrice', sql.Float, item.unit_price)
          .query(`
            INSERT INTO RecurringInvoiceItems (RecurringInvoiceId, Description, Quantity, UnitPrice)
            VALUES (@RecurringInvoiceId, @Description, @Quantity, @UnitPrice)
          `);
      }

      return recurringInvoiceId;
    });
  } catch (error) {
    throw error;
  }
};
