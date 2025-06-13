const { getAllVendors, getVendorById, createVendor, updateVendor, deleteVendor } = require('../models/vendor');

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

exports.createVendor = async (req, res) => {
  try {
    const { name, contact_email, phone } = req.body;
 
    if (!name) {
      return res.status(400).json({ 
        message: 'Vendor name is required' 
      });
    }
 
    if (contact_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact_email)) {
      return res.status(400).json({ 
        message: 'Invalid email format' 
      });
    }
 
    const newVendor = await createVendor({
      name,
      contactEmail: contact_email,
      phone
    });
 
    res.status(201).json({
      success: true,
      data: newVendor
    });
  } catch (error) {
    console.error('Create vendor error:', error);
    
    if (error.message.includes('already exists')) {
      return res.status(409).json({ 
        message: error.message 
      });
    }
    
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

exports.updateVendor = async (req, res) => {
  try {
    const vendorId = parseInt(req.params.id, 10);
    if (isNaN(vendorId)) {
      return res.status(400).json({ message: 'Invalid vendor ID' });
    }

    const { name, contact_email, phone } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Vendor name is required' });
    }

    if (contact_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact_email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    const updatedVendor = await updateVendor(vendorId, {
      name,
      contactEmail: contact_email,
      phone
    });

    if (!updatedVendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    res.json({
      success: true,
      data: updatedVendor
    });
  } catch (error) {
    console.error('Update vendor error:', error);
    if (error.message.includes('already exists')) {
      return res.status(409).json({ message: error.message });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};
 
exports.deleteVendor = async (req, res) => {
  try {
    const vendorId = parseInt(req.params.id, 10);
    if (isNaN(vendorId)) {
      return res.status(400).json({ message: 'Invalid vendor ID' });
    }

    const deleted = await deleteVendor(vendorId);

    if (!deleted) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    res.json({
      success: true,
      message: 'Vendor deleted successfully'
    });
  } catch (error) {
    console.error('Delete vendor error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};