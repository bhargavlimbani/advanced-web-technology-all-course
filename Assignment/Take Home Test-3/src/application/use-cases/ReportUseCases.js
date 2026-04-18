const bookRepository = require('../../infrastructure/repositories/BookRepository');
const transactionRepository = require('../../infrastructure/repositories/TransactionRepository');
const userRepository = require('../../infrastructure/repositories/UserRepository');

class ReportUseCases {
  async getOverdueBooks() {
    return await transactionRepository.findOverdueTransactions();
  }

  async getPopularBooks() {
    const transactions = await transactionRepository.findAll();
    
    // Count frequencies
    const bookCounts = {};
    transactions.forEach(t => {
      bookCounts[t.bookId] = (bookCounts[t.bookId] || 0) + 1;
    });

    // Sort and attach book data
    const popularBookIds = Object.keys(bookCounts).sort((a, b) => bookCounts[b] - bookCounts[a]).slice(0, 10); // top 10

    const popularBooks = popularBookIds.map(async (bookId) => {
      const book = await bookRepository.findById(bookId);
      return { book, issueCount: bookCounts[bookId] };
    });

    return await Promise.all(popularBooks);
  }

  async getUserHistory(userId) {
    const user = await userRepository.findById(userId);
    if (!user) throw new Error('User not found');

    const txs = await transactionRepository.findByUserId(userId);
    const enriched = txs.map(async (t) => {
      const book = await bookRepository.findById(t.bookId);
      return { ...t, book };
    });

    return { user: { id: user.id, name: user.name, email: user.email }, history: await Promise.all(enriched) };
  }

  async getInventorySummary() {
    const books = await bookRepository.findAll();
    
    let totalTitles = books.length;
    let totalCopies = 0;
    let totalAvailable = 0;

    books.forEach(b => {
      totalCopies += b.totalCopies;
      totalAvailable += b.availableCopies;
    });

    return {
      totalTitles,
      totalCopies,
      totalAvailable,
      totalIssued: totalCopies - totalAvailable
    };
  }
}

module.exports = new ReportUseCases();
