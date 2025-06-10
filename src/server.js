const express = require('express');
const sql = require('mssql');
const { config, appConfig } = require('./config');

const authRoutes = require('./routes/auth');
const usersRouter = require('./routes/users');
const recurringInvoiceRoutes = require('./routes/recurringInvoices');
const invoiceRoutes = require('./routes/invoices');
const paymentRoutes = require('./routes/payments');
const accountRoutes = require('./routes/accounts');
const journalEntryRoutes = require('./routes/journalEntries');

const app = express(); 
app.use(express.json());
 
app.use('/api/auth', authRoutes); 
app.use('/api/users', usersRouter); 
app.use('/api/recurring-invoices', recurringInvoiceRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/journal-entries', journalEntryRoutes);

app.listen(appConfig.port, () => {
  console.log(`Server running at http://localhost:${appConfig.port}`);
});
