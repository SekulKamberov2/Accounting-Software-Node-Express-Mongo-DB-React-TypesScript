const express = require('express');
const router = express.Router();
const { createTax, getAllTaxes, getTax } = require('../controllers/taxController');
 
router.post('/', createTax); 
router.get('/', getAllTaxes); 
router.get('/:id', getTax);

module.exports = router;
