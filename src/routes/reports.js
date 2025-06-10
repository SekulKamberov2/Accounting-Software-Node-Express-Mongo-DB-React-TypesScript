const express = require('express');
const router = express.Router();
const { getProfitAndLossReport } = require('../controllers/reportController');

router.get('/profit-loss', getProfitAndLossReport);

module.exports = router;
