const express = require('express');
const router = express.Router();
const { createInvoice ,listInvoices, getInvoiceById, updateInvoice, deleteInvoice  } = require('../controllers/invoiceController');

router.post('/', createInvoice);
router.get('/', listInvoices); 
router.get('/:id', getInvoiceById);
router.put('/:id', updateInvoice);
router.delete('/:id', deleteInvoice);


module.exports = router;
