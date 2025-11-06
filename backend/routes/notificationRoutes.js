 const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const {protect} = require('../middleware/authMiddleware');

router.get('/', protect, notificationController.getNotifications);
router.patch('/:id/read', protect, notificationController.markedread);

module.exports = router;