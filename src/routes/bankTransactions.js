const express = require('express');
const router = express.Router();
const fileUpload = require('express-fileupload');
const { importBankTransactions,  getBankTransactions, getBankTransaction } = require('../controllers/bankController');
 
router.use(fileUpload({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  abortOnLimit: true
}));
 
router.post('/import', importBankTransactions); 
router.get('/', getBankTransactions);
router.get('/:id', getBankTransaction);

module.exports = router;