
const User = require('../models/User');
const Post = require('../models/Post');
const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// === Gemini Expansion Function ===
const getRelatedKeywords = async (input) => {
  try {
    const response = await axios.post(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      contents: [
        {
          parts: [
            {
              text: `Given the topic: "${input}", return a short list of relevant keywords or categories separated by commas. Only return keywords.`
            }
          ]
        }
      ]
    });

    const raw = response.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return raw.split(',').map(s => s.trim()).filter(Boolean);
  } catch (err) {
    console.error('Gemini keyword expansion failed:', err.message);
    return [input];
  }
};

exports.searchUsersAndPosts = async (query) => {
  const { user_id, username, postType, keywords } = query;
  const filter = {};
  const userFilter = {};

  if (user_id) userFilter.user_id = user_id;
  if (username) userFilter.username = { $regex: username, $options: 'i' };

  const directUsers = Object.keys(userFilter).length > 0
    ? await User.find(userFilter, 'user_id username email profilePicture')
    : [];

  // === Build search filter using Gemini keywords ===
  let expanded = [];
  if (keywords) {
    expanded = await getRelatedKeywords(keywords);
    filter.$or = expanded.map(k => ({
      $or: [
        { message: new RegExp(`\\b${k}\\b`, 'i') },
        { postType: new RegExp(`\\b${k}\\b`, 'i') }
      ]
    }));
  }

  if (postType) filter.postType = { $regex: postType, $options: 'i' };
  if (user_id) filter.user = user_id;

  // 🔍 Strict: Only return if there is keyword match
  const posts = await Post.find(filter).populate({
    path: 'user',
    select: 'user_id username email profilePicture',
    localField: 'user',
    foreignField: 'user_id',
    model: 'User',
    justOne: true
  });

  const userIdsFromPosts = [...new Set(posts.map(p => p.user?.user_id || p.user))];
  const usersFromPosts = await User.find(
    { user_id: { $in: userIdsFromPosts } },
    'user_id username email profilePicture'
  );

  const userMap = new Map();
  [...directUsers, ...usersFromPosts].forEach(user => userMap.set(user.user_id, user));

  return { users: Array.from(userMap.values()), posts };
};
