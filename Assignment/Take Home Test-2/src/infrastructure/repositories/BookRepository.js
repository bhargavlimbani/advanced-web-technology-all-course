const JsonStorage = require('./JsonStorage');
const Book = require('../../domain/entities/Book');

class BookRepository {
  constructor() {
    this.storage = new JsonStorage('books.json');
  }

  async findAll() {
    return this.storage.read().map(b => new Book(b));
  }

  async findById(id) {
    const books = this.storage.read();
    const book = books.find(b => b.id === id);
    return book ? new Book(book) : null;
  }

  async findByIsbn(isbn) {
    const books = this.storage.read();
    const book = books.find(b => b.isbn === isbn);
    return book ? new Book(book) : null;
  }

  async save(book) {
    const books = this.storage.read();
    const existingIndex = books.findIndex(b => b.id === book.id);
    if (existingIndex >= 0) {
      books[existingIndex] = book;
    } else {
      books.push(book);
    }
    this.storage.write(books);
    return book;
  }

  async delete(id) {
    const books = this.storage.read();
    const newBooks = books.filter(b => b.id !== id);
    if (books.length !== newBooks.length) {
      this.storage.write(newBooks);
      return true;
    }
    return false;
  }

  async search(query) {
    const books = this.storage.read();
    const q = query.toLowerCase();
    return books.filter(b => 
      b.title.toLowerCase().includes(q) || 
      b.author.toLowerCase().includes(q) ||
      b.isbn.toLowerCase().includes(q)
    ).map(b => new Book(b));
  }
}

module.exports = new BookRepository();
