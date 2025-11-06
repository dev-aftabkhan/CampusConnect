const Notification = require('../models/Notification');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
// at top of file
const { connectedUsers } = require('./socket'); // Import connectedUsers map


function notificationSocket(io) {
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Token required"));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.user_id || decoded.id; // adjust field name
      next();
    } catch (err) {
      return next(new Error("Invalid token"));
    }
  });
  io.on('connection', (socket) => {
    const userId = socket.userId;
    if (!userId) return;
    connectedUsers.set(userId, socket);

    Notification.find({ user: userId, read: false })
      .sort({ createdAt: -1 })
      .then((notifs) => socket.emit('notifications', notifs));



    socket.on('disconnect', () => connectedUsers.delete(userId));
  });
};

async function triggerNotification({ user, type, from, postId, commentId, message }) {
  console.log("🧑‍💻 Online users:", Array.from(connectedUsers.keys())); // ✅ Log online users
  console.log('📬 Creating notification for:', user);



  // Dynamically build the payload with only defined fields
  const payload = {
    user,
    type,
    ...(from && { from }),
    ...(postId && { postId }),
    ...(commentId && { commentId }),
    ...(message && { message }),
  };


  console.log('📦 Notification payload:', payload);
  const notification_id = `notif-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  console.log('Generated notification_id:', notification_id);
  payload.notification_id = notification_id;
  try {
    const notif = await Notification.create(payload);
    console.log('✅ Notification saved:', notif);

    const socket = connectedUsers.get(user);
    if (socket) {
      console.log('📡 User is online. Emitting via socket.');
      socket.emit('new_notification', notif);
    } else {
      console.log('📴 User is offline. Saved only.');
    }

  } catch (err) {
    console.error('❌ Failed to create notification:', err);
  }
}


module.exports = { notificationSocket, triggerNotification };