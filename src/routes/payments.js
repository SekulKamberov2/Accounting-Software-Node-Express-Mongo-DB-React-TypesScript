const express = require('express');
const router = express.Router();
const { createPayment, listPayments, updatePayment, deletePayment } = require('../controllers/paymentController');

router.post('/', createPayment);
router.get('/', listPayments);
router.put('/', updatePayment);
router.delete('/', deletePayment);

module.exports = router;
