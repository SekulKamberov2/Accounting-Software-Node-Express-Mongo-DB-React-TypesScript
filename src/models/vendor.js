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

async function createVendor({ name, contactEmail, phone }) {
  try {
    const pool = await sql.connect(config);
    
    const result = await pool.request()
      .input('name', sql.NVarChar, name)
      .input('contactEmail', sql.NVarChar, contactEmail || null)
      .input('phone', sql.NVarChar, phone || null)
      .query(`
        INSERT INTO Vendors (Name, ContactEmail, Phone)
        VALUES (@name, @contactEmail, @phone);
        SELECT SCOPE_IDENTITY() AS id;
      `);

    pool.close();
    
    return {
      id: parseInt(result.recordset[0].id),
      name,
      contactEmail,
      phone
    };
  } catch (error) {
    if (error.number === 2627) { // SQL server unique constraint violation
      throw new Error('Vendor with this name already exists');
    }
    throw error;
  }
}

async function updateVendor(id, { name, contactEmail, phone }) {
  try {
    const pool = await sql.connect(config);

    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('name', sql.NVarChar, name)
      .input('contactEmail', sql.NVarChar, contactEmail || null)
      .input('phone', sql.NVarChar, phone || null)
      .query(`
        UPDATE Vendors
        SET 
          Name = @name,
          ContactEmail = @contactEmail,
          Phone = @phone
        WHERE Id = @id;
        
        SELECT 
          Id, Name, ContactEmail, Phone 
        FROM Vendors 
        WHERE Id = @id;
      `);

    pool.close();

    return result.recordset[0] || null;
  } catch (error) {
    if (error.number === 2627) {
      throw new Error('Vendor with this name already exists');
    }
    throw error;
  }
};

async function deleteVendor(id) {
  try {
    const pool = await sql.connect(config); 
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query(`DELETE FROM Vendors WHERE Id = @id;`); 
    pool.close(); 
    return result.rowsAffected[0] > 0;
  } catch (error) {
      throw error;
  }
};


module.exports = { getAllVendors, getVendorById, createVendor, updateVendor, deleteVendor };
