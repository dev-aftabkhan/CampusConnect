const express = require('express');
const router = express.Router();
const userController = require('../controllers/usercontroller');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');


// Route to update user profile
router.put('/profile', protect,userController.updateProfile);
router.patch('/profile-image', protect, upload.single('profilePicture'), userController.updateProfilePicture);
router.get('/:id/profile', protect, userController.getProfile);
router.get('/userprofile', protect, userController.getUserProfile);
router.get('/username/:username', protect, userController.fetchUserByUsername);

module.exports = router;