const searchService = require('../services/searchService');
 
exports.search = async (req, res) => {
  try {
    const results = await searchService.searchUsersAndPosts(req.query);
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
