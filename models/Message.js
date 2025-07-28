const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  message_id: { type: String, unique: true, required: true },
  sender: { type: String, ref: 'User', required: true },
  receiver: { type: String, ref: 'User', required: true },
  text: { type: String },
  encrypted: { type: Boolean, default: false },
  iv: { type: String },
  media: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);0
