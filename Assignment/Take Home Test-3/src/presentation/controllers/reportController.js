const reportUseCases = require('../../application/use-cases/ReportUseCases');
const logger = require('../../infrastructure/logging/logger');

exports.getOverdueBooks = async (req, res) => {
  try {
    const report = await reportUseCases.getOverdueBooks();
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPopularBooks = async (req, res) => {
  try {
    const report = await reportUseCases.getPopularBooks();
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const report = await reportUseCases.getUserHistory(userId);
    res.json(report);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

exports.getInventorySummary = async (req, res) => {
  try {
    const report = await reportUseCases.getInventorySummary();
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
