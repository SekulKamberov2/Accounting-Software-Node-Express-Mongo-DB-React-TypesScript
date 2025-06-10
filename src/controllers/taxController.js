const { createTax, getAllTaxes, getTaxById } = require('../models/tax');

exports.createTax = async (req, res) => {
  try {
    const { name, rate } = req.body;
 
    if (!name || rate === undefined) {
      return res.status(400).json({ 
        message: 'Both name and rate are required' 
      });
    }
 
    const rateNum = parseFloat(rate);
    if (isNaN(rateNum) || rateNum < 0 || rateNum > 1) {
      return res.status(400).json({ 
        message: 'Rate must be a number between 0 and 1' 
      });
    }
 
    const newTax = await createTax({
      name,
      rate: rateNum
    });
 
    res.status(201).json({
      success: true,
      data: newTax
    });
  } catch (error) {
    console.error('Create tax error:', error);
    
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

exports.getAllTaxes = async (req, res) => {
  try {
    const taxes = await getAllTaxes();
    
    res.json({
      success: true,
      count: taxes.length,
      data: taxes
    });
  } catch (error) {
    console.error('Get all taxes error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

exports.getTax = async (req, res) => {
  try {
    const taxId = parseInt(req.params.id, 10);
    if (isNaN(taxId)) {
      return res.status(400).json({ message: 'Invalid tax ID' });
    }

    const tax = await getTaxById(taxId);
    if (!tax) {
      return res.status(404).json({ message: 'Tax not found' });
    }

    res.json({
      success: true,
      data: tax
    });
  } catch (error) {
    console.error('Get tax error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};