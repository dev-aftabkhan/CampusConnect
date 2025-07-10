 const jwt = require('jsonwebtoken');
 const mongoose = require('mongoose');
const Message = require('../models/Message');

const connectedUsers = new Map();

function socketHandler(io) {
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('No token'));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded.id;
      next();
    } catch {
      return next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    connectedUsers.set(socket.user, socket);

    console.log(`User connected: ${socket.user}`);

    socket.on('send_message', async ({ to, text }) => {

      const message = await Message.create({
        message_id: new mongoose.Types.ObjectId().toString(),
        sender: socket.user,
        receiver: to,
        text
      });

      // Send message to receiver if online
      const receiverSocket = connectedUsers.get(to);
      if (receiverSocket) {
        receiverSocket.emit('receive_message', message);
      }

      // Echo to sender (confirmation)
      socket.emit('message_sent', message);
    });

    socket.on('disconnect', () => {
      connectedUsers.delete(socket.user);
      console.log(`User disconnected: ${socket.user}`);
    });
  });
}

module.exports = socketHandler;
