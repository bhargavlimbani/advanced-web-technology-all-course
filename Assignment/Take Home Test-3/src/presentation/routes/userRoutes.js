const express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const { isAuth, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

// Only librarians can manage users in this route setup
router.use(isAuth, authorize('librarian'));

router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);

router.put(
  '/:id',
  [
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('role').optional().isIn(['student', 'librarian']).withMessage('Invalid role'),
  ],
  userController.updateUser
);

router.delete('/:id', userController.deleteUser);

module.exports = router;
