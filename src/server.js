const express = require('express');
const sql = require('mssql');
const { config, appConfig } = require('./config');

const app = express();

app.get('/', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT TOP 5 * FROM YourTable'); // replace YourTable
    res.json(result.recordset);
  } catch (err) {
    console.error('SQL error', err);
    res.status(500).send('Error connecting to database');
  }
});

app.listen(appConfig.port, () => {
  console.log(`Server running at http://localhost:${appConfig.port}`);
});
