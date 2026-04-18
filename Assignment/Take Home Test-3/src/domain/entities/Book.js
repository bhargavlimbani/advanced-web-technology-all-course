class Book {
  constructor({ id, title, author, isbn, publishedYear, totalCopies, availableCopies, createdAt = new Date() }) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.isbn = isbn;
    this.publishedYear = publishedYear;
    this.totalCopies = totalCopies;
    this.availableCopies = availableCopies !== undefined ? availableCopies : totalCopies;
    this.createdAt = createdAt;
  }
}

module.exports = Book;
