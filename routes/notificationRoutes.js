const express = require('express');
const User = require('../models/User');
const router = express.Router();
const Notification = require('../models/Notification');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, async (req, res) => {
  const notifs = await Notification.find({ user: req.user, read: false }).sort({ createdAt: -1 });

  const enrichedNotifs = await Promise.all(
    notifs.map(async (notif) => {
      const notifObj = notif.toObject(); // Convert Mongoose document to plain JS object
      const user = await User.findOne({ user_id: notif.from });

      notifObj.username = user ? user.username : 'Unknown';
      notifObj.profilePicture = user ? user.profilePicture : '';

      return notifObj;
    })
  );

  res.json(enrichedNotifs);
});




router.patch('/:id/read', protect, async (req, res) => {
  await Notification.findOneAndUpdate({ notification_id: req.params.id }, { read: true });
  res.json({ message: 'Marked as read' });
});

module.exports = router;