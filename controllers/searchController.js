const { searchAll } = require('../services/searchService');

const searchController = async (req, res) => {
  try {
    const query = req.query.query;
    const result = await searchAll(query);
    res.status(200).json(result);
  } catch (err) {
    console.error('Search Error:', err.message);
    res.status(400).json({ message: err.message });
  }
};

module.exports = { searchController };
