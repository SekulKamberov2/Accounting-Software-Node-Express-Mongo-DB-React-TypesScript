const express = require('express');
const router = express.Router();
const { createPayment, listPayments, updatePayment, deletePayment } = require('../controllers/paymentController');

router.post('/', createPayment);
router.get('/', listPayments);
router.put('/:id', updatePayment);
router.delete('/:id', deletePayment);

module.exports = router;
