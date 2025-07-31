const Post = require('../models/Post');
const mongoose = require('mongoose');
const { types } = require('mongoose');
const { triggerNotification } = require('../sockets/notificationSocket');
const { connectedUsers } = require('../sockets/socket'); // Import connectedUsers map
const User = require('../models/User');




exports.createPost = async (data) => {
  const post_id = new mongoose.Types.ObjectId().toString();
  const post = new Post({ ...data, post_id });
  await post.save();
  return post;
};


exports.editPost = async (postId, userId, updates) => {
  return await Post.findOneAndUpdate({ post_id: postId, user: userId }, updates, { new: true });
};

exports.deletePost = async (postId, userId) => {
  return await Post.findOneAndDelete({ post_id: postId, user: userId });
};

exports.likePost = async (postId, userId) => {
  const post = await Post.findOne({ post_id: postId });
  const sender = await User.findOne({ user_id: userId });
  if (!post.likes.includes(userId)) {
    post.likes.push(userId);
    console.log("post.likes:", post.likes);
    await post.save();

    try {
      console.log("nofication triggered");
      await triggerNotification({
        user: post.user,          // Receiver
        type: 'like',
        from: userId,
        postId: post.post_id
      });

      // ✅ Send LIVE notification if user is online
      const targetSocket = connectedUsers.get(post.user);
      console.log("targetSocket:", targetSocket);
      if (targetSocket) {
        targetSocket.emit('notification', {
          type: 'like',
          from: userId,
          timestamp: new Date()
        });
      }
    } catch (err) {
      console.error('Error triggering like notification:', err);
    }


  }
  return post;
};

exports.unlikePost = async (postId, userId) => {
  const post = await Post.findOne({ post_id: postId });
  post.likes.pull(userId);
  await post.save();
  return post;
};

exports.addComment = async (postId, userId, text, mentions) => {
  const post = await Post.findOne({ post_id: postId });
  const sender = await User.findOne({ user_id: userId });
  const comment_id = new mongoose.Types.ObjectId().toString();
  post.comments.push({ user: userId, text, mentions, comment_id });
  await post.save();
  try {
    // Notify post owner (unless commenting on own post)
    if (post.user !== userId) {
      await triggerNotification({
        user: post.user,
        type: 'comment',
        from: userId,
        postId: post.post_id,
        comment_id
      });
      // ✅ Send LIVE notification if user is online
      const targetSocket = connectedUsers.get(post.user);
      if (targetSocket) {
        targetSocket.emit('notification', {
          type: 'comment',
          from: userId,
          timestamp: new Date()
        });
      }
    }
  } catch (err) {
    console.error('Error triggering comment notification:', err);
  }

  // Notify mentions (skip duplicates and post owner)
  const uniqueMentions = [...new Set(mentions)];
  for (const mention of uniqueMentions) {
    if (mention !== userId && mention !== post.user) {
      await triggerNotification({
        user: mention,
        type: 'mention',
        from: userId,
        postId: post.post_id,
        comment_id
      });
      // ✅ Send LIVE notification if user is online
      const targetSocket = connectedUsers.get(mention);
      if (targetSocket) {
        targetSocket.emit('notification', {
          type: 'mention',
          from: userId,
          timestamp: new Date()
        });
      }
    }
  }


  return post;
};

exports.deleteComment = async (postId, commentId, userId) => {
  const post = await Post.findOne({ post_id: postId });
  if (!post) throw new Error('Post not found');

  const commentIndex = post.comments.findIndex(c => c.comment_id === commentId);
  if (commentIndex === -1) throw new Error('Comment not found');

  const comment = post.comments[commentIndex];
  const isPostOwner = post.user === userId;
  const isCommentAuthor = comment.user === userId;

  if (!isPostOwner && !isCommentAuthor) return false;

  post.comments.splice(commentIndex, 1);
  await post.save();
  return true;
};


exports.getPopularPosts = async (limit = 10) => {
  const posts = await Post.find().lean();

  const scoredPosts = posts.map(post => {
    const likeCount = post.likes.length;
    const commentCount = post.comments.length;
    const createdAt = new Date(post.createdAt);
    const ageInHours = Math.max((Date.now() - createdAt.getTime()) / 3600000, 1); // at least 1 hour

    const score = ((likeCount * 2) + (commentCount * 3)) / ageInHours;

    return { ...post, popularityScore: score };
  });

  // Sort by highest score
  scoredPosts.sort((a, b) => b.popularityScore - a.popularityScore);

  return scoredPosts.slice(0, limit);
};

exports.getPostById = async (postId, userId) => {
  return await Post.findOne({ post_id: postId, user: userId });
};


//get recent posts
exports.getRecentPosts = async (limit = 10) => {
  return await Post.find().sort({ createdAt: -1 }).limit(limit).lean();
};

// get is post liked by user
exports.isPostLiked = async (postId, userId) => {
  const post = await Post.findOne({ post_id: postId });
  if (!post) throw new Error('Post not found');
  return post.likes.includes(userId);
};

//get post by id
exports.getPostById = async (postId) => {
  return await Post.findOne({ post_id: postId });
};