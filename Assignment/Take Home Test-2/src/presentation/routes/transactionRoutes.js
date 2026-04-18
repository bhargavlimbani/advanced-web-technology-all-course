const express = require('express');
const { body } = require('express-validator');
const transactionController = require('../controllers/transactionController');
const { isAuth, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(isAuth);

router.post(
  '/issue',
  [
    body('bookId').notEmpty().withMessage('Book ID is required')
  ],
  transactionController.issueBook
);

router.post(
  '/renew',
  [
    body('transactionId').notEmpty().withMessage('Transaction ID is required')
  ],
  transactionController.renewBook
);

router.post(
  '/return',
  [
    body('transactionId').notEmpty().withMessage('Transaction ID is required')
  ],
  transactionController.returnBook
);

module.exports = router;
