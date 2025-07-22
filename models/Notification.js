const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  notification_id: { type: String, required: true, unique: true },
  recipient: { type: String, ref: 'User', required: true },
  sender: { type: String, ref: 'User' },
  type: {
    type: String,
    enum: ['like', 'comment', 'mention', 'message', 'follow_request', 'suggestion'],
    required: true
  },
  post: { type: String, ref: 'Post' },
  comment_id: { type: String },
  message_id: { type: String },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Notification', notificationSchema);