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

  const [posts, users] = await Promise.all([
    Post.find(postMatch).populate('user_info'),
    User.find(userMatch).select('username bio profilePicture')
  ]);

  return { posts, users };
};

module.exports = { searchAll };
