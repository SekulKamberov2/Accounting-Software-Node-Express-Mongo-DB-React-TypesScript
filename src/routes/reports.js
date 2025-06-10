const express = require('express');
const router = express.Router();
const { getProfitAndLossReport, getBalanceSheet } = require('../controllers/reportController');

router.get('/profit-loss', getProfitAndLossReport);
router.get('/balance-sheet', getBalanceSheet);

module.exports = router;
