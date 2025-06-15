const express = require('express');
const router = express.Router();
const { createInvoice ,listInvoices, getInvoice, updateInvoice, deleteInvoice  } = require('../controllers/invoiceController');

router.post('/', createInvoice);
router.get('/', listInvoices); 
router.get('/:id', getInvoice);
router.put('/:id', updateInvoice);
router.delete('/:id', deleteInvoice);


module.exports = router;
