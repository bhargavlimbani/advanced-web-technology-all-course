const express = require('express');
const { body } = require('express-validator');
const bookController = require('../controllers/bookController');
const { isAuth, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post(
  '/',
  [
    isAuth,
    authorize('librarian'),
    body('title').notEmpty().withMessage('Title is required'),
    body('author').notEmpty().withMessage('Author is required'),
    body('isbn').notEmpty().withMessage('ISBN is required'),
    body('publishedYear').isNumeric().withMessage('Valid year is required'),
    body('totalCopies').isNumeric().withMessage('Valid total copies required')
  ],
  bookController.createBook
);

router.get('/', isAuth, bookController.getBooks);
router.get('/:id', isAuth, bookController.getBookById);

router.put(
  '/:id',
  [
    isAuth,
    authorize('librarian'),
    body('totalCopies').optional().isNumeric().withMessage('Must be a number')
  ],
  bookController.updateBook
);

router.delete('/:id', [isAuth, authorize('librarian')], bookController.deleteBook);

module.exports = router;
