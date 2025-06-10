const express = require('express');
const router = express.Router();
const { listVendors, getVendor } = require('../controllers/vendorController');
 
router.get('/', listVendors); 
router.get('/:id', getVendor);

module.exports = router;
