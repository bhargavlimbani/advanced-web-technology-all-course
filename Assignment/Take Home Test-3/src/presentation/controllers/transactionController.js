const transactionUseCases = require('../../application/use-cases/TransactionUseCases');
const logger = require('../../infrastructure/logging/logger');

exports.issueBook = async (req, res) => {
  try {
    const { bookId, userId } = req.body;
    // If student, they can only issue for themselves
    const issueToUserId = req.user.role === 'student' ? req.user.id : (userId || req.user.id);
    
    const transaction = await transactionUseCases.issueBook(issueToUserId, bookId);
    logger.info(`Book ${bookId} issued to User ${issueToUserId} by ${req.user.email}`);
    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.renewBook = async (req, res) => {
  try {
    const { transactionId } = req.body;
    const transaction = await transactionUseCases.renewBook(transactionId);
    logger.info(`Transaction ${transactionId} renewed by ${req.user.email}`);
    res.json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.returnBook = async (req, res) => {
  try {
    const { transactionId } = req.body;
    const transaction = await transactionUseCases.returnBook(transactionId);
    logger.info(`Transaction ${transactionId} returned by ${req.user.email} with fine ${transaction.fine}`);
    res.json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
