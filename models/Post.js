const mongoose = require('mongoose');


const commentSchema = new mongoose.Schema({
  comment_id: { type: String, required: true },
  user: { type: String, ref: 'User', required: true },
  text: { type: String, required: true },
  mentions: [{ type: String, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

 
const postSchema = new mongoose.Schema({
  post_id: { type: String, unique: true, required: true },
  user: { type: String, ref: 'User', required: true },
  message: { type: String, required: true },
  media: [{ type: String }],
  mediaType: { type: String, enum: ['image', 'video'], required: true },
  postType: { type: String, required: true },
  likes: [{ type: String, ref: 'User' }],
  comments: [commentSchema],
  mentions: [{ type: String, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Post', postSchema);