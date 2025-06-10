const sql = require('mssql');
const { config } = require('../config');

async function getAllVendors() {
  try {
    const pool = await sql.connect(config);
    
    const result = await pool.request()
      .query(`
        SELECT 
          Id, 
          Name, 
          ContactEmail, 
          Phone,
          (SELECT COUNT(*) FROM Expenses WHERE VendorId = Vendors.Id) AS ExpenseCount,
          (SELECT SUM(Amount) FROM Expenses WHERE VendorId = Vendors.Id) AS TotalSpent
        FROM Vendors
        ORDER BY Name
      `);
    
    pool.close();
    
    return result.recordset;
  } catch (error) {
    throw error;
  }
}

async function getVendorById(id) {
  try {
    const pool = await sql.connect(config);
    
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query(`
        SELECT 
          v.Id, 
          v.Name, 
          v.ContactEmail, 
          v.Phone,
          (SELECT COUNT(*) FROM Expenses e WHERE e.VendorId = v.Id) AS ExpenseCount,
          (SELECT SUM(Amount) FROM Expenses e WHERE e.VendorId = v.Id) AS TotalSpent
        FROM Vendors v
        WHERE v.Id = @id
      `);
    
    pool.close();
    
    return result.recordset[0] || null;
  } catch (error) {
    throw error;
  }
}

module.exports = { getAllVendors, getVendorById };