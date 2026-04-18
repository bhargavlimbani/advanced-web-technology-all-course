const BookModel = require('../database/models/BookModel');
const Book = require('../../domain/entities/Book');
const logger = require('../logging/logger');

class BookRepository {
  _mapToEntity(doc) {
    if (!doc) return null;
    return new Book({
      id: doc._id.toString(),
      title: doc.title,
      author: doc.author,
      isbn: doc.isbn,
      publishedYear: doc.publishedYear,
      totalCopies: doc.totalCopies,
      availableCopies: doc.availableCopies,
      createdAt: doc.createdAt
    });
  }

  async findAll() {
    try {
      const books = await BookModel.find();
      return books.map(b => this._mapToEntity(b));
    } catch (err) {
      logger.error(`BookRepository.findAll: ${err.message}`);
      throw err;
    }
  }

  async findById(id) {
    try {
      const book = await BookModel.findById(id);
      return this._mapToEntity(book);
    } catch (err) {
      if (err.name === 'CastError') return null;
      logger.error(`BookRepository.findById: ${err.message}`);
      throw err;
    }
  }

  async findByIsbn(isbn) {
    try {
      const book = await BookModel.findOne({ isbn });
      return this._mapToEntity(book);
    } catch (err) {
      logger.error(`BookRepository.findByIsbn: ${err.message}`);
      throw err;
    }
  }

  async save(book) {
    try {
      if (book.id) {
        const updated = await BookModel.findByIdAndUpdate(book.id, {
          title: book.title,
          author: book.author,
          isbn: book.isbn,
          publishedYear: book.publishedYear,
          totalCopies: book.totalCopies,
          availableCopies: book.availableCopies
        }, { new: true, runValidators: true });
        return this._mapToEntity(updated);
      } else {
        const newBook = new BookModel({
          title: book.title,
          author: book.author,
          isbn: book.isbn,
          publishedYear: book.publishedYear,
          totalCopies: book.totalCopies,
          availableCopies: book.availableCopies
        });
        const saved = await newBook.save();
        return this._mapToEntity(saved);
      }
    } catch (err) {
      logger.error(`BookRepository.save: ${err.message}`);
      throw err;
    }
  }

  async delete(id) {
    try {
      const result = await BookModel.findByIdAndDelete(id);
      return result !== null;
    } catch (err) {
      logger.error(`BookRepository.delete: ${err.message}`);
      throw err;
    }
  }

  async search(query) {
    try {
      const q = new RegExp(query, 'i');
      const books = await BookModel.find({
        $or: [
          { title: q },
          { author: q },
          { isbn: q }
        ]
      });
      return books.map(b => this._mapToEntity(b));
    } catch (err) {
      logger.error(`BookRepository.search: ${err.message}`);
      throw err;
    }
  }

  async checkBookAvailability(id) {
    try {
      const book = await BookModel.findById(id).select('availableCopies');
      return book && book.availableCopies > 0;
    } catch (err) {
      logger.error(`BookRepository.checkBookAvailability: ${err.message}`);
      throw err;
    }
  }

  async updateBookStockOnIssue(id) {
    try {
      const result = await BookModel.findOneAndUpdate(
        { _id: id, availableCopies: { $gt: 0 } },
        { $inc: { availableCopies: -1 } },
        { new: true }
      );
      return this._mapToEntity(result);
    } catch (err) {
      logger.error(`BookRepository.updateBookStockOnIssue: ${err.message}`);
      throw err;
    }
  }

  async updateBookStockOnReturn(id) {
    try {
      const result = await BookModel.findOneAndUpdate(
        { _id: id, $expr: { $lt: [ "$availableCopies", "$totalCopies" ] } },
        { $inc: { availableCopies: 1 } },
        { new: true }
      );
      if (!result) {
        const book = await BookModel.findById(id);
        return this._mapToEntity(book);
      }
      return this._mapToEntity(result);
    } catch (err) {
      logger.error(`BookRepository.updateBookStockOnReturn: ${err.message}`);
      throw err;
    }
  }
  async getInventorySummary() {
    try {
      const result = await BookModel.aggregate([
        {
          $group: {
            _id: null,
            totalTitles: { $sum: 1 },
            totalCopies: { $sum: '$totalCopies' },
            totalAvailable: { $sum: '$availableCopies' }
          }
        },
        {
          $project: {
            _id: 0,
            totalTitles: 1,
            totalCopies: 1,
            totalAvailable: 1,
            totalIssued: { $subtract: ['$totalCopies', '$totalAvailable'] }
          }
        }
      ]);
      
      return result.length > 0 ? result[0] : { totalTitles: 0, totalCopies: 0, totalAvailable: 0, totalIssued: 0 };
    } catch (err) {
      logger.error(`BookRepository.getInventorySummary: ${err.message}`);
      throw err;
    }
  }
}

module.exports = new BookRepository();
