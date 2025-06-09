const express = require('express');
const sql = require('mssql');
const { config, appConfig } = require('./config');

const app = express(); 
app.use(express.json());

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

app.listen(appConfig.port, () => {
  console.log(`Server running at http://localhost:${appConfig.port}`);
});
