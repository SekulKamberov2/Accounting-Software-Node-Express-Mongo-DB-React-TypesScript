require('dotenv').config({ path: './.env' }); 

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT, 10),
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERT === 'true',
  }
};

const appConfig = {
  port: parseInt(process.env.PORT, 10) || 3000
}; 
  
module.exports = { config, appConfig };
