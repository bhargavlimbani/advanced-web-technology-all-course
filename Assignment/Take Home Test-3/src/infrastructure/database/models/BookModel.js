const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
  },
  author: {
    type: String,
    required: [true, 'Please add an author'],
    trim: true,
  },
  isbn: {
    type: String,
    required: [true, 'Please add an ISBN'],
    unique: true,
    trim: true,
    index: true,
  },
  publishedYear: {
    type: Number,
  },
  totalCopies: {
    type: Number,
    required: [true, 'Please add total copies'],
    min: [0, 'Total copies cannot be negative'],
    default: 1,
  },
  availableCopies: {
    type: Number,
    required: [true, 'Please add available copies'],
    min: [0, 'Available copies cannot be negative'],
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Book', bookSchema);
