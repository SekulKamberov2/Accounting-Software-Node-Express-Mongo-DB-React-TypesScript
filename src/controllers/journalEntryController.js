const { createJournalEntry } = require('../models/journalEntry');

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
