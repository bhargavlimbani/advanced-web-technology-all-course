const transactionRepository = require('../../infrastructure/repositories/TransactionRepository');
const bookRepository = require('../../infrastructure/repositories/BookRepository');
const userRepository = require('../../infrastructure/repositories/UserRepository');
const Transaction = require('../../domain/entities/Transaction');
const { v4: uuidv4 } = require('uuid');

class TransactionUseCases {
  async issueBook(userId, bookId) {
    const user = await userRepository.findById(userId);
    if (!user) throw new Error('User not found');

    const book = await bookRepository.findById(bookId);
    if (!book) throw new Error('Book not found');

    if (book.availableCopies <= 0) {
      throw new Error('Book is not available for issue');
    }

    // Check if user already has an active issue of the SAME book
    const existingTx = await transactionRepository.findActiveByBookId(bookId);
    if (existingTx && existingTx.userId === userId) {
      throw new Error('User already issued this book');
    }

    // Determine due date (14 days from now)
    const issueDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(issueDate.getDate() + 14);

    const transaction = new Transaction({
      id: uuidv4(),
      bookId,
      userId,
      issueDate: issueDate.toISOString(),
      dueDate: dueDate.toISOString(),
    });

    // Update book copies
    book.availableCopies -= 1;
    await bookRepository.save(book);

    return await transactionRepository.save(transaction);
  }

  async renewBook(transactionId) {
    const transaction = await transactionRepository.findById(transactionId);
    if (!transaction || transaction.status !== 'issued') {
      throw new Error('Active transaction not found');
    }

    // Extend due date by 14 days
    const currentDue = new Date(transaction.dueDate);
    currentDue.setDate(currentDue.getDate() + 14);
    transaction.dueDate = currentDue.toISOString();

    return await transactionRepository.save(transaction);
  }

  async returnBook(transactionId) {
    const transaction = await transactionRepository.findById(transactionId);
    if (!transaction || transaction.status !== 'issued') {
      throw new Error('Active transaction not found');
    }

    const returnDate = new Date();
    transaction.returnDate = returnDate.toISOString();
    transaction.status = 'returned';

    // Calculate fine (e.g., 10 units per day overdue)
    const dueDate = new Date(transaction.dueDate);
    if (returnDate > dueDate) {
      const diffTime = Math.abs(returnDate - dueDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      transaction.fine = diffDays * 10;
    }

    // Increase book copies
    const book = await bookRepository.findById(transaction.bookId);
    if (book) {
      book.availableCopies += 1;
      await bookRepository.save(book);
    }

    return await transactionRepository.save(transaction);
  }
}

module.exports = new TransactionUseCases();
