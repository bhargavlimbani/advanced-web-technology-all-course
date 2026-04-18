const bookUseCases = require('../../application/use-cases/BookUseCases');
const logger = require('../../infrastructure/logging/logger');
const { validationResult } = require('express-validator');

exports.createBook = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const book = await bookUseCases.createBook(req.body);
    logger.info(`Book created by Librarian ${req.user.email}: ${book.title}`);
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getBooks = async (req, res) => {
  try {
    const { search } = req.query;
    let books;
    if (search) {
      books = await bookUseCases.searchBooks(search);
    } else {
      books = await bookUseCases.getAllBooks();
    }
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const book = await bookUseCases.getBook(req.params.id);
    res.json(book);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

exports.updateBook = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const book = await bookUseCases.updateBook(req.params.id, req.body);
    logger.info(`Book updated by Librarian ${req.user.email}: ${book.id}`);
    res.json(book);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    await bookUseCases.deleteBook(req.params.id);
    logger.info(`Book deleted by Librarian ${req.user.email}: ${req.params.id}`);
    res.json({ message: 'Book removed' });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
