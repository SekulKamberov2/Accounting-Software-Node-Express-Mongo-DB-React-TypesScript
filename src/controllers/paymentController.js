const { recordPayment, getAllPayments, updatePayment, deletePayment } = require('../models/payment');

exports.createPayment = async (req, res) => {
  try {
    const { invoice_id, amount, date, method } = req.body;
    console.log(invoice_id, amount, date, method);
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

exports.listPayments = async (req, res) => {
  try {
    const payments = await getAllPayments();
    res.status(200).json(payments);
  } catch (error) {
    console.error('List payments error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

exports.updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { invoice_id, amount, date, method } = req.body;

    if (!invoice_id || !amount || !date || !method) {
      return res.status(400).json({ message: 'Missing required payment fields.' });
    }

    const result = await updatePayment(id, { invoice_id, amount, date, method });
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Payment not found.' });
    }

    res.status(200).json({ message: 'Payment updated successfully.' });
  } catch (error) {
    console.error('Update payment error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

exports.deletePayment = async (req, res) => {
  try {
    const { id } = req.params; 
    const result = await deletePayment(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Payment not found.' });
    }

    res.status(200).json({ message: 'Payment deleted successfully.' });
  } catch (error) {
    console.error('Delete payment error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};
