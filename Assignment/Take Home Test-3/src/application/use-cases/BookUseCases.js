const bookRepository = require('../../infrastructure/repositories/BookRepository');
const Book = require('../../domain/entities/Book');

class BookUseCases {
  async createBook(data) {
    const existing = await bookRepository.findByIsbn(data.isbn);
    if (existing) {
      throw new Error('Book with this ISBN already exists');
    }
    const newBook = new Book({
      ...data
    });
    return await bookRepository.save(newBook);
  }

  async getBook(id) {
    const book = await bookRepository.findById(id);
    if (!book) throw new Error('Book not found');
    return book;
  }

  async getAllBooks() {
    return await bookRepository.findAll();
  }

  async updateBook(id, data) {
    const book = await bookRepository.findById(id);
    if (!book) throw new Error('Book not found');
    
    // Validate copies business logic
    if (data.totalCopies !== undefined) {
      const diff = data.totalCopies - book.totalCopies;
      book.totalCopies = data.totalCopies;
      book.availableCopies += diff;
      if (book.availableCopies < 0) {
        throw new Error('Cannot reduce total copies below currently issued ones');
      }
    }

    Object.assign(book, data);
    return await bookRepository.save(book);
  }

  async deleteBook(id) {
    const deleted = await bookRepository.delete(id);
    if (!deleted) throw new Error('Book not found');
    return true;
  }

  async searchBooks(query) {
    return await bookRepository.search(query);
  }
}

module.exports = new BookUseCases();
