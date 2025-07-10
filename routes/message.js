const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const message = require('../controllers/messageController');

router.get('/:userId', protect, message.getMessages);


module.exports = router;