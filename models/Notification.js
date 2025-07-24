const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  notification_id: { type: String, unique: true },
  user: { type: String, ref: 'User', required: true }, // receiver
  type: {
    type: String,
    enum: ['like', 'comment', 'mention', 'message', 'follow_request', 'suggestion'],
    required: true
  },
  from: { type: String, ref: 'User' }, // who triggered it
  postId: { type: String, ref: 'Post' }, // optional for post-related
  commentId: { type: String },
  message: { type: String },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Notification', notificationSchema);

