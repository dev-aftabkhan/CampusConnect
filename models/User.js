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
  profilePicture: {
    type: String,
    default: '', // Placeholder URL
  },
  bio: {
    type: String,
    default: '',
  },
  location: {
    type: String,
  },
  interests: {
    type: [String], // Array of strings for interests
    default: [],
  },

  follower: [{
    type: String,
    ref: 'User',
    default: [],
  }],
  following: [{
    type: String,
    ref: 'User',
    default: [],
  }],
  followRequests: [{ 
    type: String, 
    ref: 'User',
    default: [],
  }]
   
}, { timestamps: true },
{
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

userSchema.virtual('followRequestsInfo', {
  ref: 'User',
  localField: 'followRequests',
  foreignField: 'user_id',
  justOne: false
});
userSchema.virtual('followerInfo', {
  ref: 'User',
  localField: 'follower',
  foreignField: 'user_id',
  justOne: false
});
userSchema.virtual('followingInfo', {
  ref: 'User',
  localField: 'following',
  foreignField: 'user_id',
  justOne: false
});


 
module.exports = mongoose.model('User', userSchema);
