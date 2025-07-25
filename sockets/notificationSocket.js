const Notification = require('../models/Notification');
const crypto = require('crypto');
const connectedUsers = new Map();

function notificationSocket(io) {
  io.on('connection', (socket) => {
    const userId = socket.handshake.auth?.userId;
    if (!userId) return;
    connectedUsers.set(userId, socket);

    Notification.find({ user: userId, read: false })
      .sort({ createdAt: -1 })
      .then((notifs) => socket.emit('notifications', notifs));

    socket.on('mark_as_read', async (notificationId) => {
      await Notification.findOneAndUpdate({ notification_id: notificationId }, { read: true });
    });

    socket.on('disconnect', () => connectedUsers.delete(userId));
  });
}

async function triggerNotification({ user, type, from, postId, commentId, message }) {
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
    const notification_id = `${crypto.randomBytes(4).toString('hex')}`;
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