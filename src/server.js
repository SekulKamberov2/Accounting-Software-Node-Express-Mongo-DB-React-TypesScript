const express = require('express');
const sql = require('mssql');
const { config, appConfig } = require('./config');
const fs = require('fs');

const authRoutes = require('./routes/auth');
const usersRouter = require('./routes/users');
const recurringInvoiceRoutes = require('./routes/recurringInvoices');
const invoiceRoutes = require('./routes/invoices');
const paymentRoutes = require('./routes/payments');
const accountRoutes = require('./routes/accounts');
const journalEntryRoutes = require('./routes/journalEntries');
const reportRoutes = require('./routes/reports'); 
const expenseRoutes = require('./routes/expenses');
const vendorRoutes = require('./routes/vendors');
const path = require('path');
const fileUpload = require('express-fileupload');
const bankTransactionRoutes = require('./routes/bankTransactions');
const taxRoutes = require('./routes/taxes');
  
const app = express(); 

app.use(cors()); 
app.use(cors({
  origin: 'http://localhost:3000',  
  credentials: true  
}));

app.use(express.json());

app.use('/api/auth', authRoutes); 
app.use('/api/users', usersRouter); 
app.use('/api/recurring-invoices', recurringInvoiceRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/journal-entries', journalEntryRoutes);
app.use('/api/reports', reportRoutes); 
app.use('/api/expenses', expenseRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/bank-transactions', bankTransactionRoutes);

app.use(fileUpload()); //enable file uploads 
const uploadDir = path.join(__dirname, 'uploads');  //create uploads directory if it doesn't exist
if (!fs.existsSync(uploadDir)) { 
  fs.mkdirSync(uploadDir); 
}
app.use('/api/taxes', taxRoutes);

app.listen(appConfig.port, () => {
  console.log(`Server running at http://localhost:${appConfig.port}`);
});
