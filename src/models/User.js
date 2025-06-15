const sql = require('mssql');
const bcrypt = require('bcrypt');
const { config } = require('../config');  

async function findByEmail(email) {
  try {
    const pool = await sql.connect(config);
    
    const result = await pool.request()
      .input('email', sql.NVarChar, email)
      .query('SELECT Id, Name, Email, PasswordHash, Role, Picture FROM Users WHERE Email = @email');
 
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
 
async function createUser({ name, email, passwordHash, role, picture }) {
  const pool = await sql.connect(config);
  await pool.request()
    .input('name', sql.NVarChar, name)
    .input('email', sql.NVarChar, email)
    .input('passwordHash', sql.NVarChar, passwordHash)
    .input('role', sql.NVarChar, role)
    .input('picture', sql.NVarChar, picture)
    .query(`
      INSERT INTO Users (Name, Email, PasswordHash, Role, Picture)
      VALUES (@name, @email, @passwordHash, @role, @picture)
    `);
}

async function updateUser(id, { name, email, role, picture }) {
  const pool = await sql.connect(config);

  await pool.request()
    .input('id', sql.Int, id)
    .input('name', sql.NVarChar, name)
    .input('email', sql.NVarChar, email)
    .input('role', sql.NVarChar, role)
    .input('picture', sql.NVarChar, picture)
    .query(`
      UPDATE Users
      SET Name = @name,
          Email = @email,
          Role = @role,
          Picture = @picture
      WHERE Id = @id
    `);
}


async function findUserByRefreshToken(token) {
  const pool = await sql.connect(config);
  const result = await pool
    .request()
    .input('token', sql.NVarChar, token)
    .query('SELECT * FROM Users WHERE RefreshToken = @token');

  return result.recordset[0];
};

async function updateRefreshToken(userId, token, expiry) {
  const pool = await sql.connect(config);
  await pool
    .request()
    .input('id', sql.Int, userId)
    .input('token', sql.NVarChar, token)
    .input('expiry', sql.DateTime, expiry)
    .query(`
      UPDATE Users
      SET RefreshToken = @token, RefreshTokenExpiry = @expiry
      WHERE Id = @id
    `);
};

async function fetchAllUsers() {
  const pool = await sql.connect(config);
  const result = await pool.request().query(`
    SELECT Id, Name, Email, Role, Picture, CreatedAt
    FROM Users
  `);
  return result.recordset;
}; 

async function fetchUserById(userId) {
  const pool = await sql.connect(config);
  const result = await pool
    .request()
    .input('id', sql.Int, userId)
    .query(`
      SELECT Id, Name, Email, Role, CreatedAt, RefreshToken, RefreshTokenExpiry, PasswordHash
      FROM Users
      WHERE Id = @id
    `); 
  return result.recordset[0] || null;
};

async function deleteUser(id) {
  const pool = await sql.connect(config);
  await pool.request()
    .input('id', sql.Int, id)
    .query('DELETE FROM Users WHERE Id = @id');
}

module.exports = { 
    findByEmail, 
    comparePassword, 
    createUser, 
    updateUser,
    deleteUser,
    findUserByRefreshToken, 
    updateRefreshToken, 
    fetchAllUsers,
    fetchUserById   
};
