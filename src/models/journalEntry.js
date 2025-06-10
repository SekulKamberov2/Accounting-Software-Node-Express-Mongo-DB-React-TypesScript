const sql = require('mssql');
const { config } = require('../config');

exports.createJournalEntry = async ({ date, description, entries }) => {
  const pool = await sql.connect(config);
  const transaction = new sql.Transaction(pool); 
  try {
    await transaction.begin();

    const journalResult = await transaction.request()
      .input('Date', sql.Date, date)
      .input('Description', sql.NVarChar, description || null)
      .query(`
        INSERT INTO JournalEntries (Date, Description)
        OUTPUT INSERTED.Id
        VALUES (@Date, @Description)
      `);

    const journalEntryId = journalResult.recordset[0].Id;

    for (const entry of entries) {
      await transaction.request()
        .input('JournalEntryId', sql.Int, journalEntryId)
        .input('AccountId', sql.Int, entry.account_id)
        .input('Debit', sql.Float, entry.debit || 0)
        .input('Credit', sql.Float, entry.credit || 0)
        .query(`
          INSERT INTO JournalEntryLines (JournalEntryId, AccountId, Debit, Credit)
          VALUES (@JournalEntryId, @AccountId, @Debit, @Credit)
        `);
    }

    await transaction.commit();

    return { journalEntryId };
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};
