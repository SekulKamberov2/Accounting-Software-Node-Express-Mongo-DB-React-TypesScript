const sql = require('mssql');
const bcrypt = require('bcrypt');
const { config } = require('../config');  // Import config from your config module

async function findByEmail(email) {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('email', sql.NVarChar, email)
      .query('SELECT Id, Name, Email, PasswordHash, Role FROM Users WHERE Email = @email');

    pool.close();

    if (result.recordset.length === 0) return null;

    return result.recordset[0];
  } catch (error) {
    throw error;
  }
}

async function comparePassword(inputPassword, hashedPassword) {
  return await bcrypt.compare(inputPassword, hashedPassword);
}

module.exports = { findByEmail, comparePassword };
