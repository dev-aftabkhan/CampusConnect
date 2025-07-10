const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const searchController = require('../controllers/searchController');

// Search route
router.get('/', protect, searchController.search);
 
module.exports = router;