class Transaction {
  constructor({ id, bookId, userId, issueDate, dueDate, returnDate = null, status = 'issued', fine = 0 }) {
    this.id = id;
    this.bookId = bookId; // Reference to book
    this.userId = userId; // Reference to user
    this.issueDate = issueDate || new Date();
    this.dueDate = dueDate; 
    this.returnDate = returnDate;
    this.status = status; // 'issued' or 'returned'
    this.fine = fine;
  }
}

module.exports = Transaction;
