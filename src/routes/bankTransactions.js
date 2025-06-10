const express = require('express');
const router = express.Router();
const fileUpload = require('express-fileupload');
const { importBankTransactions } = require('../controllers/bankController');

// enable file upload middleware
router.use(fileUpload({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  abortOnLimit: true
}));

// POST /api/bank-transactions/import - import bank transactions from CSV
router.post('/import', importBankTransactions);

module.exports = router;