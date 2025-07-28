const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const postController = require('../controllers/postController');

router.post('/', protect, upload.array('media', 5), postController.createPost);
router.put('/:id', protect, upload.array('media', 5), postController.editPost);
router.delete('/:id', protect, postController.deletePost);
router.post('/:id/like', protect, postController.likePost);
router.post('/:id/unlike', protect, postController.unlikePost);
router.post('/:id/comment', protect, postController.addComment);
router.delete('/:id/comment/:commentId', protect, postController.deleteComment);
router.get('/popular', protect, postController.getPopularPosts);
router.get('/recentposts', protect, postController.getRecentPosts);
router.get('/:id/isliked', protect, postController.isPostLiked);
router.get('/:id', protect, postController.getPostById);


module.exports = router;
