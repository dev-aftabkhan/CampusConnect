// update the user profile
const userService = require('../services/userService');
const { validationResult } = require('express-validator');
 
const path = require('path'); 
 
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

     // ✅ Delete old image (if exists)
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