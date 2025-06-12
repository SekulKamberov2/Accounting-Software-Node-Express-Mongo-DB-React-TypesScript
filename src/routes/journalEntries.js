const express = require('express');
const router = express.Router(); 
const { createEntry, listEntries, getEntryById, updateEntry, deleteEntry } = require('../controllers/journalEntryController');

router.post('/', createEntry);
router.get('/', listEntries);
router.get('/:id', getEntryById);
router.put('/:id', updateEntry);
router.delete('/:id', deleteEntry);

module.exports = router;
