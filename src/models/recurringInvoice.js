const sql = require('mssql');
const { config } = require('../config');

exports.createRecurringInvoice = async ({ customerId, interval, startDate, items }) => {
  const pool = await sql.connect(config);
  const transaction = new sql.Transaction(pool);
  try {
    await transaction.begin();
 
    const invoiceResult = await transaction.request()
      .input('CustomerId', sql.Int, customerId)
      .input('Interval', sql.NVarChar(50), interval)
      .input('StartDate', sql.Date, startDate)
      .query(`
        INSERT INTO RecurringInvoices (CustomerId, Interval, StartDate)
        OUTPUT INSERTED.Id
        VALUES (@CustomerId, @Interval, @StartDate)
      `);

    const recurringInvoiceId = invoiceResult.recordset[0].Id;
 
    for (const item of items) {
      await transaction.request()
        .input('RecurringInvoiceId', sql.Int, recurringInvoiceId)
        .input('Description', sql.NVarChar(255), item.description)
        .input('Quantity', sql.Int, item.quantity)
        .input('UnitPrice', sql.Float, item.unitPrice)
        .query(`
          INSERT INTO RecurringInvoiceItems (RecurringInvoiceId, Description, Quantity, UnitPrice)
          VALUES (@RecurringInvoiceId, @Description, @Quantity, @UnitPrice)
        `);
    }

    await transaction.commit();

    return { id: recurringInvoiceId };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

exports.getAllRecurringInvoices = async () => {
  const pool = await sql.connect(config);
  const result = await pool.request().query(`
    SELECT 
      ri.Id AS RecurringInvoiceId,
      ri.CustomerId,
      ri.Interval,
      ri.StartDate,
      rii.Id AS ItemId,
      rii.Description,
      rii.Quantity,
      rii.UnitPrice
    FROM RecurringInvoices ri
    LEFT JOIN RecurringInvoiceItems rii ON ri.Id = rii.RecurringInvoiceId
    ORDER BY ri.Id, rii.Id
  `);

  const grouped = {};
  result.recordset.forEach(row => {
    if (!grouped[row.RecurringInvoiceId]) {
      grouped[row.RecurringInvoiceId] = {
        id: row.RecurringInvoiceId,
        customerId: row.CustomerId,
        interval: row.Interval,
        startDate: row.StartDate,
        items: []
      };
    }
    if (row.ItemId) {
      grouped[row.RecurringInvoiceId].items.push({
        id: row.ItemId,
        description: row.Description,
        quantity: row.Quantity,
        unitPrice: row.UnitPrice
      });
    }
  });

  return Object.values(grouped);
};

exports.getRecurringInvoiceById = async (id) => {
  const pool = await sql.connect(config);
  const result = await pool.request()
    .input('Id', sql.Int, id)
    .query(`
      SELECT 
        ri.Id AS RecurringInvoiceId,
        ri.CustomerId,
        ri.Interval,
        ri.StartDate,
        rii.Id AS ItemId,
        rii.Description,
        rii.Quantity,
        rii.UnitPrice
      FROM RecurringInvoices ri
      LEFT JOIN RecurringInvoiceItems rii ON ri.Id = rii.RecurringInvoiceId
      WHERE ri.Id = @Id
      ORDER BY rii.Id
    `);

  if (result.recordset.length === 0) return null;

  const rows = result.recordset;
  const invoice = {
    id: rows[0].RecurringInvoiceId,
    customerId: rows[0].CustomerId,
    interval: rows[0].Interval,
    startDate: rows[0].StartDate,
    items: []
  };

  for (const row of rows) {
    if (row.ItemId) {
      invoice.items.push({
        id: row.ItemId,
        description: row.Description,
        quantity: row.Quantity,
        unitPrice: row.UnitPrice
      });
    }
  }

  return invoice;
};

exports.updateRecurringInvoice = async ({ id, customerId, interval, startDate, items }) => {
  const pool = await sql.connect(config);
  const transaction = new sql.Transaction(pool);
  try {
    await transaction.begin();
 
    await transaction.request()
      .input('Id', sql.Int, id)
      .input('CustomerId', sql.Int, customerId)
      .input('Interval', sql.NVarChar(50), interval)
      .input('StartDate', sql.Date, startDate)
      .query(`
        UPDATE RecurringInvoices
        SET CustomerId = @CustomerId,
            Interval = @Interval,
            StartDate = @StartDate
        WHERE Id = @Id
      `);
 
    await transaction.request()
      .input('RecurringInvoiceId', sql.Int, id)
      .query(`DELETE FROM RecurringInvoiceItems WHERE RecurringInvoiceId = @RecurringInvoiceId`);
 
    for (const item of items) {
      await transaction.request()
        .input('RecurringInvoiceId', sql.Int, id)
        .input('Description', sql.NVarChar(255), item.description)
        .input('Quantity', sql.Int, item.quantity)
        .input('UnitPrice', sql.Float, item.unitPrice)
        .query(`
          INSERT INTO RecurringInvoiceItems (RecurringInvoiceId, Description, Quantity, UnitPrice)
          VALUES (@RecurringInvoiceId, @Description, @Quantity, @UnitPrice)
        `);
    }

    await transaction.commit();

    return { id };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

exports.deleteRecurringInvoice = async (id) => {
  const pool = await sql.connect(config);
  try { 
    await pool.request()
      .input('Id', sql.Int, id)
      .query(`DELETE FROM RecurringInvoices WHERE Id = @Id`);
  } catch (error) {
    throw error;
  }
};
