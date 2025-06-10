const express = require('express');
const router = express.Router();
const { createEntry } = require('../controllers/journalEntryController');
const { listEntries } = require('../controllers/journalEntryController');

router.post('/', createEntry);
router.get('/', listEntries);

module.exports = router;
