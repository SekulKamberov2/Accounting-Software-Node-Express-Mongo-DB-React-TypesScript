const { createRecurringInvoice, getAllRecurringInvoices, getRecurringInvoiceById, deleteRecurringInvoice, updateRecurringInvoice } = require('../models/recurringInvoice');

exports.createRecurringInvoice = async (req, res) => {
  try {
    const { customerId, interval, startDate, items } = req.body;

    if (!customerId || !interval || !startDate || !Array.isArray(items) || items.length < 1) {
      return res.status(400).json({ message: 'Missing or invalid fields' });
    }

    const result = await createRecurringInvoice({ customerId, interval, startDate, items });

    res.status(201).json({
      message: 'Recurring invoice created successfully',
      id: result.id
    });
  } catch (error) {
    console.error('Create recurring invoice error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getAllRecurringInvoices = async (req, res) => {
  try {
    const invoices = await getAllRecurringInvoices();
    res.json(invoices);
  } catch (error) {
    console.error('List recurring invoices error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getRecurringInvoiceById = async (req, res) => {
  try {
    const invoiceId = parseInt(req.params.id, 10);
    if (isNaN(invoiceId)) {
      return res.status(400).json({ message: 'Invalid recurring invoice ID' });
    }

    const invoice = await getRecurringInvoiceById(invoiceId);

    if (!invoice) {
      return res.status(404).json({ message: 'Recurring invoice not found' });
    }

    res.json(invoice);
  } catch (error) {
    console.error('Get recurring invoice error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteRecurringInvoice = async (req, res) => {
  try {
    const invoiceId = parseInt(req.params.id, 10);
    if (isNaN(invoiceId)) {
      return res.status(400).json({ message: 'Invalid recurring invoice ID' });
    }

    const existingInvoice = await getRecurringInvoiceById(invoiceId);
    if (!existingInvoice) {
      return res.status(404).json({ message: 'Recurring invoice not found' });
    }

    await deleteRecurringInvoice(invoiceId);

    res.json({ message: 'Recurring invoice deleted successfully' });
  } catch (error) {
    console.error('Delete recurring invoice error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateRecurringInvoice = async (req, res) => {
  try {
    const invoiceId = parseInt(req.params.id, 10);
    const { customerId, interval, startDate, items } = req.body;

    if (isNaN(invoiceId)) {
      return res.status(400).json({ message: 'Invalid recurring invoice ID' });
    }

    if (!customerId || !interval || !startDate || !Array.isArray(items) || items.length < 1) {
      return res.status(400).json({ message: 'Missing or invalid fields' });
    }

    const existingInvoice = await getRecurringInvoiceById(invoiceId);
    if (!existingInvoice) {
      return res.status(404).json({ message: 'Recurring invoice not found' });
    }

    await updateRecurringInvoice({ id: invoiceId, customerId, interval, startDate, items });

    res.json({ message: 'Recurring invoice updated successfully' });
  } catch (error) {
    console.error('Update recurring invoice error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};