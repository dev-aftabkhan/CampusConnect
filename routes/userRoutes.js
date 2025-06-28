const express = require('express');
const router = express.Router();
const userController = require('../controllers/usercontroller');
const { protect } = require('../middleware/authMiddleware');


// Route to update user profile
router.put('/profile', protect,userController.updateProfile);

module.exports = router;