const sql = require('mssql');
const { config } = require('../config');

exports.createAccount = async ({ name, type, code }) => { 
    const pool = await sql.connect(config);
    await pool.request()
    .input('Name', sql.NVarChar(100), name)
    .input('Type', sql.NVarChar(50), type)
    .input('Code', sql.NVarChar(20), code)
    .query(`
        INSERT INTO Accounts (Name, Type, Code)
        VALUES (@Name, @Type, @Code)
    `);
};

exports.getAllAccounts = async () => {
  const pool = await sql.connect(config); 
  const result = await pool.request().query(`
    SELECT Id, Name, Type, Code
    FROM Accounts
    ORDER BY Code
  `); 
  return result.recordset;
};

