const sql = require('mssql');
const { config } = require('../config');

async function createTax({ name, rate }) {
  try {
    const pool = await sql.connect(config);
    
    const result = await pool.request()
      .input('name', sql.NVarChar, name)
      .input('rate', sql.Float, rate)
      .query(`
        INSERT INTO Taxes (Name, Rate)
        VALUES (@name, @rate);
        SELECT SCOPE_IDENTITY() AS id;
      `);

    pool.close();
    
    return {
      id: parseInt(result.recordset[0].id),
      name,
      rate
    };
  } catch (error) {
    if (error.number === 2627) { // SQL Server unique constraint violation
      throw new Error('Tax with this name already exists');
    }
    throw error;
  }
}

async function getAllTaxes() {
  try {
    const pool = await sql.connect(config);
    
    const result = await pool.request()
      .query('SELECT Id, Name, Rate FROM Taxes ORDER BY Name');
    
    pool.close();
    
    return result.recordset;
  } catch (error) {
    throw error;
  }
}

async function getTaxById(id) {
  try {
    const pool = await sql.connect(config);
    
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT Id, Name, Rate FROM Taxes WHERE Id = @id');
    
    pool.close();
    
    return result.recordset[0] || null;
  } catch (error) {
    throw error;
  }
}

async function updateTax({ id, name, rate }) {
  try {
    const pool = await sql.connect(config);

    await pool.request()
      .input('id', sql.Int, id)
      .input('name', sql.NVarChar, name)
      .input('rate', sql.Float, rate)
      .query(`
        UPDATE Taxes
        SET Name = @name,
            Rate = @rate
        WHERE Id = @id
      `);

    pool.close();
  } catch (error) {
    if (error.number === 2627) { //unique constraint violation
      throw new Error('Tax with this name already exists');
    }
    throw error;
  }
}
 
async function deleteTax(id) {
  try {
    const pool = await sql.connect(config);

    await pool.request()
      .input('id', sql.Int, id)
      .query(`DELETE FROM Taxes WHERE Id = @id`);

    pool.close();
  } catch (error) {
    throw error;
  }
}

module.exports = { createTax, getAllTaxes, getTaxById, updateTax, deleteTax };