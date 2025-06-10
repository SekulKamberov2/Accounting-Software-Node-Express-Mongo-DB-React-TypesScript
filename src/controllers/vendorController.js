const { getAllVendors, getVendorById } = require('../models/vendor');

exports.listVendors = async (req, res) => {
  try {
    const vendors = await getAllVendors();
    
    res.json({
      success: true,
      count: vendors.length,
      data: vendors
    });
  } catch (error) {
    console.error('List vendors error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

exports.getVendor = async (req, res) => {
  try {
    const vendorId = parseInt(req.params.id, 10);
    if (isNaN(vendorId)) {
      return res.status(400).json({ message: 'Invalid vendor ID' });
    }

    const vendor = await getVendorById(vendorId);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    res.json({
      success: true,
      data: vendor
    });
  } catch (error) {
    console.error('Get vendor error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};