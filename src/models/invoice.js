const sql = require('mssql');
const { config } = require('../config');

exports.createInvoice = async ({ customer_id, date, tax_rate, items }) => {
  const pool = await sql.connect(config);
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();

    const request = new sql.Request(transaction);
    request.input('CustomerId', sql.Int, customer_id);
    request.input('Date', sql.Date, date);
    request.input('TaxRate', sql.Float, tax_rate);
 
    const invoiceResult = await request.query(`
      INSERT INTO Invoices (CustomerId, Date, TaxRate)
      OUTPUT INSERTED.Id
      VALUES (@CustomerId, @Date, @TaxRate)
    `);

    const invoiceId = invoiceResult.recordset[0].Id;
 
    for (const item of items) {
      const itemRequest = new sql.Request(transaction);
      itemRequest.input('InvoiceId', sql.Int, invoiceId);
      itemRequest.input('Description', sql.NVarChar, item.description);
      itemRequest.input('Quantity', sql.Int, item.quantity);
      itemRequest.input('UnitPrice', sql.Float, item.unit_price);

      await itemRequest.query(`
        INSERT INTO InvoiceItems (InvoiceId, Description, Quantity, UnitPrice)
        VALUES (@InvoiceId, @Description, @Quantity, @UnitPrice)
      `);
    }

    await transaction.commit();
    return { invoiceId };
  } catch (error) {
    await transaction.rollback();
    console.error('createInvoice error:', error);
    throw error;
  }
};

exports.getAllInvoices = async () => {
  try {
    const pool = await sql.connect(config);
 
    const invoiceResult = await pool.request().query(`
      SELECT 
        i.Id, 
        i.CustomerId, 
        i.Date, 
        i.TaxRate, 
        i.CreatedAt,
        u.Name AS CustomerName,
        u.Email AS CustomerEmail,
        u.Picture AS CustomerPicture
      FROM Invoices i
      INNER JOIN Users u ON i.CustomerId = u.Id
      ORDER BY i.Date DESC
    `);

    const invoices = invoiceResult.recordset;
 
    for (const invoice of invoices) {
      const itemResult = await pool.request()
        .input('InvoiceId', sql.Int, invoice.Id)
        .query(`
          SELECT Description, Quantity, UnitPrice
          FROM InvoiceItems
          WHERE InvoiceId = @InvoiceId
        `);

      const items = itemResult.recordset;
 
      invoice.items = items.map(item => ({
        ...item,
        Amount: item.Quantity * item.UnitPrice
      }));
    }

    return invoices;
  } catch (error) {
    console.error('getAllInvoices error:', error);
    throw error;
  }
};


exports.getInvoiceById = async (invoiceId) => {
  try {
    const pool = await sql.connect(config);

    // Join with Users table to fetch customer info
    const invoiceResult = await pool.request()
      .input('InvoiceId', sql.Int, invoiceId)
      .query(`
        SELECT 
          i.Id, 
          i.CustomerId, 
          i.Date, 
          i.TaxRate,
          u.Name AS CustomerName,
          u.Email AS CustomerEmail,
          u.Picture AS CustomerPicture
        FROM Invoices i
        INNER JOIN Users u ON i.CustomerId = u.Id
        WHERE i.Id = @InvoiceId
      `);

    if (invoiceResult.recordset.length === 0) {
      return null; 
    }

    const invoice = invoiceResult.recordset[0];
 
    const itemResult = await pool.request()
      .input('InvoiceId', sql.Int, invoiceId)
      .query(`
        SELECT Description, Quantity, UnitPrice
        FROM InvoiceItems
        WHERE InvoiceId = @InvoiceId
      `);

    invoice.items = itemResult.recordset.map(item => ({
      ...item,
      Amount: item.Quantity * item.UnitPrice
    }));

    return invoice;
  } catch (error) {
    console.error('getInvoiceById error:', error);
    throw error;
  }
};


exports.updateInvoiceById = async (invoiceId, { CustomerId, Date, TaxRate, items }) => {
  const pool = await sql.connect(config);
  const transaction = new sql.Transaction(pool);
  console.log(invoiceId, CustomerId, Date, TaxRate, items);
  try {
    await transaction.begin();
 
    await transaction.request()
      .input('InvoiceId', sql.Int, invoiceId)
      .input('CustomerId', sql.Int, CustomerId)
      .input('Date', sql.Date, Date)
      .input('TaxRate', sql.Float, TaxRate)
      .query(`
        UPDATE Invoices
        SET CustomerId = @CustomerId,
            Date = @Date,
            TaxRate = @TaxRate
        WHERE Id = @InvoiceId
      `);
 
    await transaction.request()
      .input('InvoiceId', sql.Int, invoiceId)
      .query('DELETE FROM InvoiceItems WHERE InvoiceId = @InvoiceId');
 
    for (const item of items) {
      await transaction.request()
        .input('InvoiceId', sql.Int, invoiceId)
        .input('Description', sql.NVarChar, item.description)
        .input('Quantity', sql.Int, item.quantity)
        .input('UnitPrice', sql.Float, item.unit_price)
        .query(`
          INSERT INTO InvoiceItems (InvoiceId, Description, Quantity, UnitPrice)
          VALUES (@InvoiceId, @Description, @Quantity, @UnitPrice)
        `);
    }

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    console.error('updateInvoiceById error:', error);
    throw error;
  }
};

exports.deleteInvoiceById = async (id) => {
   const pool = await sql.connect(config);
  const invoiceResult = await pool.request()
    .input('id', sql.Int, id)
    .query('SELECT Id FROM Invoices WHERE Id = @id');

  if (invoiceResult.recordset.length === 0) {
    return false; 
  }
 
  const transaction = new sql.Transaction(pool);
  await transaction.begin();

  try {
    const request = new sql.Request(transaction); 
    await request.input('id', sql.Int, id)
      .query('DELETE FROM Invoices WHERE Id = @id');

    await transaction.commit();

    return true;
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
}