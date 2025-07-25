const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Message = require('../models/Message');
const { mongo, default: mongoose } = require('mongoose');
const { triggerNotification } = require('./notificationSocket'); 
 
//const { encrypt, decrypt } = require('../utils/encryptor');

const connectedUsers = new Map();

function socketHandler(io) {
  io.use(async (socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('No token'));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findOne({ user_id: decoded.id });
      if (!user) return next(new Error('User not found'));

      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    connectedUsers.set(socket.user.user_id, socket);
    console.log(`🔗 ${socket.user.username} connected`);

    socket.on('send_message', async ({ to, text }) => {
      try {
        const receiver = await User.findOne({ user_id: to });
        if (!receiver) return socket.emit('error', 'Receiver not found');

        // ✅ Only allow if mutual follow
        const isMutual = socket.user.following.includes(to) && receiver.following.includes(socket.user.user_id);
        if (!isMutual) return socket.emit('error', 'You can only message mutual followers');

        // ✅ Save message
        const message = await Message.create({
          message_id: new mongoose.Types.ObjectId().toString(),
          sender: socket.user.user_id,
          receiver: to,
          text
        });

        // ✅ Emit to sender
        socket.emit('message_sent', message);

        // ✅ Emit to receiver if online
        const targetSocket = connectedUsers.get(to);
        if (targetSocket) {
          targetSocket.emit('receive_message', message);
        }else{
          // ✅ If offline, send notification
          await triggerNotification({
            user: to,
            type: 'message',
            from: socket.user.user_id,
            message: text
          });
        }

      } catch (err) {
        socket.emit('error', 'Failed to send message');
      }
    });

    socket.on('disconnect', () => {
      connectedUsers.delete(socket.user.user_id);
      console.log(`❌ ${socket.user.username} disconnected`);
    });
  });
}

module.exports = socketHandler;
