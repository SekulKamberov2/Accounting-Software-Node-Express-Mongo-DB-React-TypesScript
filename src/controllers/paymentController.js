const { recordPayment } = require('../models/payment');

exports.createPayment = async (req, res) => {
  try {
    const { invoice_id, amount, date, method } = req.body;

    if (!invoice_id || !amount || !date || !method) {
      return res.status(400).json({ message: 'Missing required payment fields.' });
    }

    await recordPayment({ invoice_id, amount, date, method });

    res.status(201).json({ message: 'Payment recorded successfully.' });
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};
