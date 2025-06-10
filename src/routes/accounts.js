const express = require('express');
const router = express.Router();
const { createAccount, getAccounts } = require('../controllers/accountController');

router.post('/', createAccount);
router.get('/', getAccounts);


module.exports = router;
