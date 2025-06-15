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

exports.getAccountById = async (id) => {
    const pool = await sql.connect(config);
    const result = await pool.request()
        .input('Id', sql.Int, id)
        .query(`
            SELECT Id, Name, Type, Code
            FROM Accounts
            WHERE Id = @Id
        `);
    return result.recordset[0];   
};

exports.updateAccount = async ({ Id, Name, Type, Code }) => {
    console.log(Id, Name, Type, Code);
    const pool = await sql.connect(config);
    await pool.request()
        .input('Id', sql.Int, Id)
        .input('Name', sql.NVarChar(100), Name)
        .input('Type', sql.NVarChar(50), Type)
        .input('Code', sql.NVarChar(20), Code)
        .query(`
            UPDATE Accounts
            SET Name = @Name,
                Type = @Type,
                Code = @Code
            WHERE Id = @Id
        `);
};

exports.deleteAccount = async (id) => {
    const pool = await sql.connect(config);
    await pool.request()
        .input('Id', sql.Int, id)
        .query(`
            DELETE FROM Accounts
            WHERE Id = @Id
        `);
};