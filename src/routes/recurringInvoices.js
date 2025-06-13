const express = require('express');
const router = express.Router();
const { createRecurringInvoice, getAllRecurringInvoices, getRecurringInvoiceById, deleteRecurringInvoice, updateRecurringInvoice } = require('../controllers/recurringInvoiceController');

router.post('/', createRecurringInvoice);
router.get('/', getAllRecurringInvoices);
router.get('/:id', getRecurringInvoiceById);
router.delete('/:id', deleteRecurringInvoice);
router.put('/:id', updateRecurringInvoice);

module.exports = router;
