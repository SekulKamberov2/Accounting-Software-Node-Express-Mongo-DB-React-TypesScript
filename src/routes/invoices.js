const express = require('express');
const router = express.Router();
const { createInvoice ,listInvoices, getInvoiceById  } = require('../controllers/invoiceController');

router.post('/', createInvoice);
router.get('/', listInvoices); 
router.get('/:id', getInvoiceById);


module.exports = router;
