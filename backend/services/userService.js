const User = require('../models/User');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

exports.createUser = async ({ username, email, phone, password }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  // ✅ Manually generate a unique user_id here
  const user_id = `${username.toLowerCase()}-${crypto.randomBytes(4).toString('hex')}`;

  const user = new User({ user_id, username, email, phone, password: hashedPassword });
  return await user.save();
};

exports.findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

exports.findUserByPhone = async (phone) => {
  return await User.findOne({ phone });
};

exports.findUserByUsername = async (username) => {
  return await User.findOne({ username });
};

exports.findUserByEmailOrPhone = async (identifier) => {
  return await User.findOne({ $or: [{ email: identifier }, { phone: identifier }] });
};

exports.findUserById = async (user_id) => {
  return await User.findOne({ user_id });
};

exports.updateuser = async (user, updateData) => {
   Object.entries(updateData).forEach(([key, value]) => {
    if (value !== undefined) {
      user[key] = value;
    }
  });
  return await user.save();
};

exports.getprofilebyid = async (user_id) => {
  return await User.findOne({ user_id}).select('user_id username email phone profilePicture bio interests follower following');
};

// get user by username
exports.getUserByUsername = async (username) => {
  const user = await User.findOne({ username }).select('-password');
  if (!user) throw new Error('User not found');
  return user;
};

// get common users present in both follower and following list
exports.getCommonUsers = async (user_id) => {
  const user = await User.findOne({ user_id }).select('follower following');
  if (!user) throw new Error('User not found');

  // Get common user_ids
  const followerSet = new Set(user.follower.map(String));
  const followingSet = new Set(user.following.map(String));

  const commonIds = [...followerSet].filter(id => followingSet.has(id));

  // Fetch common users
  const commonUsers = await User.find({ user_id: { $in: commonIds } })
    .select('user_id username profilePicture');

  return commonUsers;
};

