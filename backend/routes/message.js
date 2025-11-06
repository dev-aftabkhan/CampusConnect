const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const message = require('../controllers/messageController');

router.get('/:userId', protect, message.getMessages);
router.get('/chathistory/:partnerId', protect, message.chathistory);


module.exports = router;