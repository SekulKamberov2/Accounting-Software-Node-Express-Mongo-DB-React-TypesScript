const express = require('express');
const router = express.Router();
const { createRecurringInvoice } = require('../controllers/recurringInvoiceController');

router.post('/', createRecurringInvoice);

module.exports = router;
