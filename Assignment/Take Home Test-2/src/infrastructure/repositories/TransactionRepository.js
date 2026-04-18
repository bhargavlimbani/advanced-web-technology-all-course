const JsonStorage = require('./JsonStorage');
const Transaction = require('../../domain/entities/Transaction');

class TransactionRepository {
  constructor() {
    this.storage = new JsonStorage('transactions.json');
  }

  async findAll() {
    return this.storage.read().map(t => new Transaction(t));
  }

  async findById(id) {
    const tx = this.storage.read().find(t => t.id === id);
    return tx ? new Transaction(tx) : null;
  }

  async findActiveByBookId(bookId) {
    const tx = this.storage.read().find(t => t.bookId === bookId && t.status === 'issued');
    return tx ? new Transaction(tx) : null;
  }
  
  async findActiveByUserId(userId) {
    return this.storage.read().filter(t => t.userId === userId && t.status === 'issued').map(t => new Transaction(t));
  }
  
  async findByUserId(userId) {
    return this.storage.read().filter(t => t.userId === userId).map(t => new Transaction(t));
  }

  async save(transaction) {
    const txs = this.storage.read();
    const existingIndex = txs.findIndex(t => t.id === transaction.id);
    if (existingIndex >= 0) {
      txs[existingIndex] = transaction;
    } else {
      txs.push(transaction);
    }
    this.storage.write(txs);
    return transaction;
  }
}

module.exports = new TransactionRepository();
