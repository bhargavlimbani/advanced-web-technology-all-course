const bookRepository = require('../../infrastructure/repositories/BookRepository');
const transactionRepository = require('../../infrastructure/repositories/TransactionRepository');
const userRepository = require('../../infrastructure/repositories/UserRepository');

class ReportUseCases {
  async getOverdueBooks() {
    return await transactionRepository.findOverdueTransactions();
  }

  async getPopularBooks() {
    return await transactionRepository.findPopularBooks();
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
    return await bookRepository.getInventorySummary();
  }
}

module.exports = new ReportUseCases();
