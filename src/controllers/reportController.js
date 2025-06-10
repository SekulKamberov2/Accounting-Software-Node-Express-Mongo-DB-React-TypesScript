const { fetchProfitAndLoss } = require('../models/report');

exports.getProfitAndLossReport = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;

    if (!start_date || !end_date) {
      return res.status(400).json({ message: 'start_date and end_date are required' });
    }

    const report = await fetchProfitAndLoss(start_date, end_date);

    res.json(report);
  } catch (error) {
    console.error('Error generating Profit and Loss report:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
