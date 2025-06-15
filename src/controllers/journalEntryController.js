const { createJournalEntry, getAllJournalEntries, getJournalEntryById, deleteJournalEntry, updateJournalEntry  } = require('../models/journalEntry');

exports.createEntry = async (req, res) => {
  try {
    const { date, description, entries } = req.body;

    if (!date || !Array.isArray(entries) || entries.length < 1) {
      return res.status(400).json({ message: 'Missing or invalid fields' });
    }

    const result = await createJournalEntry({ date, description, entries });

    res.status(201).json({
      message: 'Journal entry created successfully',
      journalEntryId: result.journalEntryId
    });
  } catch (error) {
    console.error('Create journal entry error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.listEntries = async (req, res) => {
  try {
    const entries = await getAllJournalEntries();
    res.json(entries);
  } catch (error) {
    console.error('List journal entries error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getEntryById = async (req, res) => {
  try {
    const entryId = parseInt(req.params.id, 10);
    if (isNaN(entryId)) {
      return res.status(400).json({ message: 'Invalid journal entry ID' });
    }

    const entry = await getJournalEntryById(entryId);

    if (!entry) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }

    res.json(entry);
  } catch (error) {
    console.error('Get journal entry error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
 
exports.deleteEntry = async (req, res) => {
  try {
    const entryId = parseInt(req.params.id, 10);
    if (isNaN(entryId)) {
      return res.status(400).json({ message: 'Invalid journal entry ID' });
    }

    const existingEntry = await getJournalEntryById(entryId);
    if (!existingEntry) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }

    await deleteJournalEntry(entryId);

    res.json({ message: 'Journal entry deleted successfully' });
  } catch (error) {
    console.error('Delete journal entry error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
 
exports.updateEntry = async (req, res) => {
  try {
    const entryId = parseInt(req.params.id, 10);
    const { date, description, entries } = req.body;
  
    if (isNaN(entryId)) {
      return res.status(400).json({ message: 'Invalid journal entry ID' });
    }

    if (!date || !Array.isArray(entries) || entries.length < 1) {
      return res.status(400).json({ message: 'Missing or invalid fields' });
    }

    const existingEntry = await getJournalEntryById(entryId);
    if (!existingEntry) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }

    await updateJournalEntry({ id: entryId, date, description, entries });

    res.json({ message: 'Journal entry updated successfully' });
  } catch (error) {
    console.error('Update journal entry error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
