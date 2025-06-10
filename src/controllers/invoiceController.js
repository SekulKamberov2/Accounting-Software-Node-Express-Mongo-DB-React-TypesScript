const { createInvoice , getAllInvoices, getInvoiceById, updateInvoiceById, deleteInvoiceById    } = require('../models/invoice');

exports.createInvoice = async (req, res) => {
  try {
    const { customer_id, date, tax_rate, items } = req.body;

    if (!customer_id || !date || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    const result = await createInvoice({ customer_id, date, tax_rate, items });

    res.status(201).json({
      message: 'Invoice created successfully',
      invoiceId: result.invoiceId
    });
  } catch (error) {
    console.error('Create invoice error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.listInvoices = async (req, res) => {
  try {
    const invoices = await getAllInvoices();
    res.json(invoices);
  } catch (error) {
    console.error('List invoices error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

 exports.getInvoiceById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid invoice ID' });
    }

    const invoice = await getInvoiceById(id);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.json(invoice);
  } catch (error) {
    console.error('Get invoice by ID error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateInvoice = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid invoice ID' });
    }

    const { customer_id, date, tax_rate, items } = req.body;

    if (!customer_id || !date || !items || !Array.isArray(items)) {
      return res.status(400).json({ message: 'Missing required invoice fields.' });
    }

    await updateInvoiceById(id, { customer_id, date, tax_rate, items });

    res.json({ message: 'Invoice updated successfully.' });
  } catch (error) {
    console.error('Update invoice error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteInvoice = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid invoice ID' });
    }

    const deleted = await deleteInvoiceById(id); 
    if (!deleted) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.json({ message: 'Invoice deleted successfully.' });
  } catch (error) {
    console.error('Delete invoice error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};