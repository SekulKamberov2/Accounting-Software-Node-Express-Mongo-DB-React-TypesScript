const { createAccount, getAllAccounts, getAccountById, updateAccount, deleteAccount  } = require('../models/account');

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

exports.getAccountById = async (req, res) => {
  try {
    const { id } = req.params;

    const account = await getAccountById(parseInt(id));
    if (!account) {
      return res.status(404).json({ message: 'Account not found.' });
    }

    res.json(account);
  } catch (error) {
    console.error('Get account by ID error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, code } = req.body;

    if (!name || !type || !code) {
      return res.status(400).json({ message: 'Missing required account fields.' });
    }

    await updateAccount({ id: parseInt(id), name, type, code });

    res.json({ message: 'Account updated successfully.' });
  } catch (error) {
    console.error('Update account error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const { id } = req.params;

    await deleteAccount(parseInt(id));

    res.json({ message: 'Account deleted successfully.' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
