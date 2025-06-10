const express = require('express');
const router = express.Router();
const { createEntry } = require('../controllers/journalEntryController');

router.post('/', createEntry);

module.exports = router;
