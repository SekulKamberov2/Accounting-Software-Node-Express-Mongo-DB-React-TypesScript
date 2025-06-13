const express = require('express');
const router = express.Router();
const { listVendors, getVendor, createVendor, updateVendor, deleteVendor } = require('../controllers/vendorController');
 
router.get('/', listVendors); 
router.get('/:id', getVendor);
router.post('/', createVendor);
router.put('/:id', updateVendor);
router.delete('/:id', deleteVendor);

module.exports = router;
