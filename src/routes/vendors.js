const express = require('express');
const router = express.Router();
const { listVendors, getVendor, createVendor } = require('../controllers/vendorController');
 
router.get('/', listVendors); 
router.get('/:id', getVendor);
router.post('/', createVendor);

module.exports = router;
