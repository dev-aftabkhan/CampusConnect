const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, async (req, res) => {
  const notifs = await Notification.find({ user: req.user, read: false }).sort({ createdAt: -1 });
  res.json(notifs);
});



router.patch('/:id/read', protect, async (req, res) => {
  await Notification.findOneAndUpdate({ notification_id: req.params.id }, { read: true });
  res.json({ message: 'Marked as read' });
});

module.exports = router;