const express = require('express');
const router = express.Router();
const { createTax, getAllTaxes, getTax, updateTax, deleteTax } = require('../controllers/taxController');
 
router.post('/', createTax); 
router.get('/', getAllTaxes); 
router.get('/:id', getTax);
router.put('/:id', updateTax);
router.delete('/:id', deleteTax);

module.exports = router;
