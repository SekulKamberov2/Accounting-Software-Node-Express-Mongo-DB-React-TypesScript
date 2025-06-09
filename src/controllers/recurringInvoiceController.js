const { createRecurringInvoice } = require('../models/recurringInvoice');

exports.createRecurringInvoice = async (req, res) => {
  try {
    const { customer_id, interval, start_date, items } = req.body;

    if (!customer_id || !interval || !start_date || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Missing or invalid required fields.' });
    }

    for (const item of items) {
      if (!item.description || typeof item.quantity !== 'number' || typeof item.unit_price !== 'number') {
        return res.status(400).json({ message: 'Invalid item format.' });
      }
    }

    const recurringInvoiceId = await createRecurringInvoice({ customer_id, interval, start_date, items });

    res.status(201).json({
      message: 'Recurring invoice created successfully',
      recurringInvoiceId
    });
  } catch (error) {
    console.error('Create recurring invoice error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
