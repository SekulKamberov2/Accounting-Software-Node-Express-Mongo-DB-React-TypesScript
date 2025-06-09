const express = require('express');
const router = express.Router();
const { login, register, refreshToken  } = require('../controllers/authController');

router.post('/login', login);
router.post('/register', register);
router.post('/refresh', refreshToken); 

 
module.exports = router;
