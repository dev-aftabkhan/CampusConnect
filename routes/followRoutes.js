const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const followController = require('../controllers/followController');

router.post('/:id/follow-request', protect, followController.requestFollow);
router.get('/follow-requests', protect, followController.getPendingRequests);
router.post('/:id/follow-accept', protect, followController.acceptFollow);
router.post('/:id/follow-reject', protect, followController.rejectFollow);
router.get('/:id/followers', protect, followController.getFollowers);
router.get('/:id/following', protect, followController.getFollowing);
router.get('/:id/mutuals', protect, followController.getMutuals);
router.post('/:id/unfollow', protect, followController.unfollowUser);

module.exports = router;