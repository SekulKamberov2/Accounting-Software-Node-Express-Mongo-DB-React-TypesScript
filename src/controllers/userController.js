const { createUser: createUserModel, fetchAllUsers, fetchUserById, findByEmail } = require('../models/User');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await fetchAllUsers(); 
    const sanitizedUsers = users.map(({ PasswordHash, RefreshToken, RefreshTokenExpiry, ...rest }) => rest);

    res.json(sanitizedUsers);
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
 
