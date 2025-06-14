const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

const { createUser, updateUser, deleteUser, fetchAllUsers, fetchUserById, findByEmail } = require('../models/User');

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, picture } = req.body; 
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    const existing = await findByEmail(email);
    if (existing) {
      return res.status(409).json({ message: 'Email already in use.' });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS); 
    await createUser({ name, email, passwordHash, role, picture });

    res.status(201).json({ message: 'User created successfully.' });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { name, email, role, picture } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid user ID.' });
    }

    const user = await fetchUserById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    await updateUser(id, { name, email, role, picture });

    res.json({ message: 'User updated successfully.' });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid user ID.' });
    }

    const user = await fetchUserById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    await deleteUser(id);
    res.json({ message: 'User deleted successfully.' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await fetchAllUsers(); 
    const sanitized = users.map(({ PasswordHash, RefreshToken, RefreshTokenExpiry, ...rest }) => rest);
 
    res.json(sanitized); 
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user ID.' });
    } 

    const user = await fetchUserById(userId); 
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
 
    const { PasswordHash, RefreshToken, RefreshTokenExpiry, ...sanitizedUser } = user;

    res.json(sanitizedUser);
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
 
