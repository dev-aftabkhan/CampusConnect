const Post = require('../models/Post');
const User = require('../models/User');

const searchAll = async (query) => {
  if (!query) throw new Error('Query string is required');

  const postMatch = {
    $or: [
      { message: { $regex: query, $options: 'i' } },
      { postType: { $regex: query, $options: 'i' } }
    ]
  };

  const userMatch = { username: { $regex: query, $options: 'i' } };

  const [postsRaw, users] = await Promise.all([
    Post.find(postMatch).populate('user_info'),
    User.find(userMatch).select('username bio profilePicture')
  ]);

  const posts = [];

  for (const post of postsRaw) {
    const postUser = await User.findOne({ user_id: post.user }).select('username profilePicture');
    const plainPost = post.toObject();

    plainPost.username = postUser?.username || 'Unknown';
    plainPost.profilePicture = postUser?.profilePicture || '';

    // Add username & profilePicture to each comment
    if (plainPost.comments && Array.isArray(plainPost.comments)) {
      const enrichedComments = await Promise.all(
        plainPost.comments.map(async (comment) => {
          const commentUser = await User.findOne({ user_id: comment.user }).select('username profilePicture');
          return {
            ...comment,
            username: commentUser?.username || 'Unknown',
            profilePicture: commentUser?.profilePicture || '',
          };
        })
      );
      plainPost.comments = enrichedComments;
    }

    posts.push(plainPost);
  }
  return { posts, users };
};

module.exports = { searchAll };
