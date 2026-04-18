const express = require('express');
const reportController = require('../controllers/reportController');
const { isAuth, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(isAuth, authorize('librarian'));

router.get('/overdue', reportController.getOverdueBooks);
router.get('/popular', reportController.getPopularBooks);
router.get('/inventory', reportController.getInventorySummary);
router.get('/user-history/:userId', reportController.getUserHistory);

module.exports = router;
