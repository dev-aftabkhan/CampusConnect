// update the user profile
const userService = require('../services/userService');
const { validationResult } = require('express-validator');
const fs = require('fs');
const Post = require('../models/Post');
const User = require('../models/User');
 
const path = require('path'); 


exports.getProfile = async (req, res) => {
  const user_id = req.params.id;
  const currentUser = req.user; // Assuming current user is stored in req.user
  console.log('Fetching profile for user:', user_id);
  try {
    const user = await userService.getprofilebyid(user_id); 
    const currentUserData = await userService.getprofilebyid(currentUser);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 🔍 Get the user's posts
    const posts = await Post.find({ user: user.user_id }).sort({ createdAt: -1 });

    // 🧮 Get counts
    const postCount = posts.length;
    const followerCount = Array.isArray(user.follower) ? user.follower.length : 0;
    const followingCount = Array.isArray(user.following) ? user.following.length : 0;
    // get mutuals count and users
    const mutuals = user.follower.filter(f => currentUserData.following.includes(f));
    const mutualCount = mutuals.length || 0;

    res.status(200).json({
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        profilePicture: user.profilePicture,
        bio: user.bio,
        interests: user.interests,
        postCount,
        followerCount,
        followingCount,
        posts,
        mutualCount,
        mutuals,
      },
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
 
exports.updateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
   
  const user_id  = req.user; // Assuming user_id is stored in req.user after authentication
   

  console.log('Updating profile for user:', user_id, 'with data:', req.body);

  try {
    const user = await userService.findUserById(req.user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user profile with the provided data
    const updates = {};
    const { username, email, phone, bio, interests } = req.body;

    // Username check
    if (username && username !== user.username) {
      const existingUser = await userService.findUserByUsername(username);
      if (existingUser) return res.status(400).json({ message: 'Username already taken' });
      updates.username = username;
    }
    // Email check
    if (email && email !== user.email) {
      const existingUser = await userService.findUserByEmail(email);
      if (existingUser) return res.status(400).json({ message: 'Email already exists' });
      updates.email = email;
    }
    // Phone check
    if (phone && phone !== user.phone) {
      const existingUser = await userService.findUserByPhone(phone);
      if (existingUser) return res.status(400).json({ message: 'Phone number already registered' });
      updates.phone = phone;
    }

    // Bio update
    if (bio) {
      updates.bio = bio;
    }

    // Interests update
    if (interests) {
       try {
            // If sent as JSON string (from frontend), parse it
            const parsed = typeof interests === 'string' ? JSON.parse(interests) : interests;

            if (Array.isArray(parsed)) {
              updates.interests = parsed;
            } else {
                return res.status(400).json({ message: 'Interests must be an array' });
            }
        } catch (err) {
             return res.status(400).json({ message: 'Invalid JSON in interests' });
        }     
    }
     
    const updatedUser = await userService.updateuser(user, updates);

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        bio: updatedUser.bio,   
        username: updatedUser.username,
        email: updatedUser.email,
        phone: updatedUser.phone,
        interests: updatedUser.interests,
      },
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProfilePicture = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No image uploaded' });

  try {
    const user = await userService.findUserById(req.user);
    if (!user) return res.status(404).json({ message: 'User not found' });

     //Delete old image (if exists)
    if (user.profilePicture) {
      const imagePath = path.join(
        __dirname,
        '..',
        'uploads',
        'profile',
        path.basename(user.profilePicture)
      );

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log('Old image deleted:', imagePath);
      } else {
        console.log('Old image not found at:', imagePath);
      }
    }
    const newPath = `${req.protocol}://${req.get('host')}/uploads/profile/${req.file.filename}`;

    user.profilePicture = newPath;
    await user.save();

    res.json({ message: 'Profile picture updated', profilePicture: newPath });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserProfile = async (req, res) => {
  const user_id = req.user;
  console.log('Fetching profile for user:', user_id);

  try {
    const user = await userService.getprofilebyid(user_id);
    console.log("Full User Object >>>", user);
    console.log("Type of user.follower:", typeof user.follower);
    console.log("Follower Array:", user.follower);
    console.log("Following Array:", user.following);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 🔍 Get the user's posts
    const posts = await Post.find({ user: user.user_id }).sort({ createdAt: -1 });

    // 🧮 Get counts
    const postCount = posts.length;
    const followerCount = Array.isArray(user.follower) ? user.follower.length : 0;
    const followingCount = Array.isArray(user.following) ? user.following.length : 0;

    // ✅ Return full profile
    res.status(200).json({
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        profilePicture: user.profilePicture,
        bio: user.bio,
        interests: user.interests,
        postCount,
        followerCount,
        followingCount,
        posts // full post list
      },
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.fetchUserByUsername = async (req, res) => {
  try {
    const username = req.params.username;
    const user = await userService.getUserByUsername(username);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

 