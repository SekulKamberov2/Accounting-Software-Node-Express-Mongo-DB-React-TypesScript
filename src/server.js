const express = require('express');
const sql = require('mssql');
const { config, appConfig } = require('./config');

const authRoutes = require('./routes/auth');
const usersRouter = require('./routes/users');
const recurringInvoiceRoutes = require('./routes/recurringInvoices');
const invoiceRoutes = require('./routes/invoices');
const paymentRoutes = require('./routes/payments');

const app = express(); 
app.use(express.json());
 
app.use('/api/auth', authRoutes); 
app.use('/api/users', usersRouter); 
app.use('/api/recurring-invoices', recurringInvoiceRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/payments', paymentRoutes);



app.listen(appConfig.port, () => {
  console.log(`Server running at http://localhost:${appConfig.port}`);
});
