const TransactionModel = require('../database/models/TransactionModel');
const Transaction = require('../../domain/entities/Transaction');
const logger = require('../logging/logger');

class TransactionRepository {
  _mapToEntity(doc) {
    if (!doc) return null;
    return new Transaction({
      id: doc._id.toString(),
      bookId: doc.bookId.toString(),
      userId: doc.userId.toString(),
      issueDate: doc.issueDate,
      dueDate: doc.dueDate,
      returnDate: doc.returnDate,
      status: doc.status,
      fine: doc.fine,
      createdAt: doc.createdAt
    });
  }

  async findAll() {
    try {
      const txs = await TransactionModel.find();
      return txs.map(t => this._mapToEntity(t));
    } catch (err) {
      logger.error(`TransactionRepository.findAll: ${err.message}`);
      throw err;
    }
  }

  async findById(id) {
    try {
      const tx = await TransactionModel.findById(id);
      return this._mapToEntity(tx);
    } catch (err) {
      if (err.name === 'CastError') return null;
      logger.error(`TransactionRepository.findById: ${err.message}`);
      throw err;
    }
  }

  async findActiveByBookId(bookId) {
    try {
      const tx = await TransactionModel.findOne({ bookId, status: 'issued' });
      return this._mapToEntity(tx);
    } catch (err) {
      logger.error(`TransactionRepository.findActiveByBookId: ${err.message}`);
      throw err;
    }
  }
  
  async findActiveByUserId(userId) {
    try {
      const txs = await TransactionModel.find({ userId, status: 'issued' });
      return txs.map(t => this._mapToEntity(t));
    } catch (err) {
      logger.error(`TransactionRepository.findActiveByUserId: ${err.message}`);
      throw err;
    }
  }
  
  async findByUserId(userId) {
    try {
      const txs = await TransactionModel.find({ userId });
      return txs.map(t => this._mapToEntity(t));
    } catch (err) {
      logger.error(`TransactionRepository.findByUserId: ${err.message}`);
      throw err;
    }
  }

  async save(transaction) {
    try {
      if (transaction.id) {
        // Update
        const updated = await TransactionModel.findByIdAndUpdate(transaction.id, {
          bookId: transaction.bookId,
          userId: transaction.userId,
          issueDate: transaction.issueDate,
          dueDate: transaction.dueDate,
          returnDate: transaction.returnDate,
          status: transaction.status,
          fine: transaction.fine
        }, { new: true, runValidators: true });
        return this._mapToEntity(updated);
      } else {
        // Create
        const newTx = new TransactionModel({
          bookId: transaction.bookId,
          userId: transaction.userId,
          issueDate: transaction.issueDate,
          dueDate: transaction.dueDate,
          status: transaction.status
        });
        const saved = await newTx.save();
        return this._mapToEntity(saved);
      }
    } catch (err) {
      logger.error(`TransactionRepository.save: ${err.message}`);
      throw err;
    }
  }

  async findOverdueTransactions() {
    try {
      // Aggregation incorporating $lt for dueDate vs current time.
      const overdue = await TransactionModel.aggregate([
        {
          $match: {
            status: 'issued',
            dueDate: { $lt: new Date() }
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $lookup: {
            from: 'books',
            localField: 'bookId',
            foreignField: '_id',
            as: 'book'
          }
        },
        {
          $unwind: '$user'
        },
        {
          $unwind: '$book'
        },
        {
          $project: {
            _id: 1,
            issueDate: 1,
            dueDate: 1,
            'user.name': 1,
            'user.email': 1,
            'book.title': 1,
            'book.isbn': 1
          }
        }
      ]);
      return overdue;
    } catch (err) {
      logger.error(`TransactionRepository.findOverdueTransactions: ${err.message}`);
      throw err;
    }
  }
}

module.exports = new TransactionRepository();
