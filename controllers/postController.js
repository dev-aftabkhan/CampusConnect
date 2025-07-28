const Post = require('../models/Post');
const User = require('../models/User');
const postService = require('../services/postService');
const fs = require('fs');
const path = require('path');

exports.createPost = async (req, res) => {
  try {
    const files = req.files.map(f => {
        const folder = f.mimetype.startsWith('video') ? 'videos' : 'images';
        return `${req.protocol}://${req.get('host')}/uploads/posts/${folder}/${f.filename}`;
    });

    const post = await postService.createPost({
      user: req.user,
      message: req.body.message,
      media: files,
      mediaType: req.body.mediaType,
      postType: req.body.postType,
      mentions: req.body.mentions || []
    });
    res.json(post);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.editPost = async (req, res) => {
  try {
    const updates = { ...req.body };

    // Fetch the current post
    const existingPost = await postService.getPostById(req.params.id, req.user);
    if (!existingPost) return res.status(404).json({ message: 'Post not found or not authorized' });

    // Ensure the user is the owner of the post
    if (existingPost.user.toString() !== req.user.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this post' });
    }

    const newFiles = Array.isArray(req.files)
      ? req.files.map(file => `${req.protocol}://${req.get('host')}/uploads/posts/${file.filename}`)
      : [];

    if (newFiles && newFiles.length > 0) {
      // Delete old media files
      for (const filePath of existingPost.media) {
        const safePath = filePath.startsWith('/') ? filePath.slice(1) : filePath; // remove leading slash
        const localPath = path.resolve(__dirname, '..', safePath);

        console.log('Deleting:', localPath); // debug log

        if (fs.existsSync(localPath)) {
          fs.unlinkSync(localPath);
        }
      }


      // Set new media and mediaType
      updates.media = newFiles;
      updates.mediaType = req.body.mediaType || 'image';
    }

    const updatedPost = await postService.editPost(req.params.id, req.user, updates);
    res.json(updatedPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


exports.deletePost = async (req, res) => {
  try {
    const post = await postService.deletePost(req.params.id, req.user);
    // delete the post images/videos from the filesystem 
    if (post.media && post.media.length > 0) {
      const fs = require('fs');
      const path = require('path');
      post.media.forEach(media => {
        const mediaPath = path.join(__dirname, '..', 'uploads', 'posts', media.startsWith('videos') ? 'videos' : 'images', path.basename(media));
        if (fs.existsSync(mediaPath)) {
          fs.unlinkSync(mediaPath);
        }
      });
    }
    if (!post) return res.status(403).json({ message: 'Not allowed' });
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.likePost = async (req, res) => {
  try {
    const post = await postService.likePost(req.params.id, req.user);
    res.json({ likes: post.likes.length });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.unlikePost = async (req, res) => {
  try {
    const post = await postService.unlikePost(req.params.id, req.user);
    res.json({ likes: post.likes.length });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user;

    // Find the post first
    const post = await Post.findOne({ post_id: postId });
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Get the owner of the post
    const postOwner = await User.findOne({ user_id: post.user });
    if (!postOwner) return res.status(404).json({ message: 'Post owner not found' });

    // Check if the current user is a follower or the owner
    const isFollower = postOwner.follower.includes(userId); // <-- assuming array of strings
    const isOwner = postOwner.user_id === userId;
    

    if (!isFollower && !isOwner) {
      return res.status(403).json({ message: 'Only followers can comment' });
    }

    // Add comment using service
    const posts = await postService.addComment(postId, userId, req.body.text, req.body.mentions || []);
    res.json(posts.comments);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { id: postId, commentId } = req.params;
    const userId = req.user;

    const success = await postService.deleteComment(postId, commentId, userId);
    if (!success) return res.status(403).json({ message: 'Not allowed' });

    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getPopularPosts = async (req, res) => {
  try {
    const posts = await postService.getPopularPosts(10);
    res.json({ posts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


//get recent posts
exports.getRecentPosts = async (req, res) => {
  try {
    const posts = await postService.getRecentPosts(10);
    // username and profile picture for each post
    for (const post of posts) {
      const user = await User.findOne({ user_id: post.user });
      post.username = user ? user.username : 'Unknown';
      post.profilePicture = user ? user.profilePicture : '';
    }
    // comment username and profile picture
    for (const post of posts) {
      for (const comment of post.comments) {
        const user = await User.findOne({ user_id: comment.user });
        comment.username = user ? user.username : 'Unknown';
        comment.profilePicture = user ? user.profilePicture : '';
      }
    }

    res.json({ posts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// get is post liked by user
exports.isPostLiked = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user;

    const isLiked = await postService.isPostLiked(postId, userId);
    res.json({ isLiked });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};