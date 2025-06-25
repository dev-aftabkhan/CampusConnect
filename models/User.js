const mongoose = require('mongoose');
const { type } = require('os');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  user_id: {
    type: String, 
    unique: true,
    required: [true, 'User ID is required'],
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
   
}, { timestamps: true });

 

module.exports = mongoose.model('User', userSchema);
