const { createAccount, getAllAccounts  } = require('../models/account');

exports.createAccount = async (req, res) => {
  try {
    const { name, type, code } = req.body;

    if (!name || !type || !code) {
      return res.status(400).json({ message: 'Missing required account fields.' });
    }

    await createAccount({ name, type, code });

    res.status(201).json({ message: 'Account created successfully.' });
  } catch (error) {
    console.error('Create account error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

exports.getAccounts = async (req, res) => {
  try {
    const accounts = await getAllAccounts();
    res.json(accounts);
  } catch (error) {
    console.error('Get accounts error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};