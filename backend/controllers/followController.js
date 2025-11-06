const followService = require('../services/followService');

exports.requestFollow = async (req, res) => {
  try {
    await followService.sendFollowRequest(req.user, req.params.id);
    res.json({ message: 'Follow request sent' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getPendingRequests = async (req, res) => {
  try {
    const requests = await followService.getIncomingRequests(req.user);
    res.json({ requests });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.acceptFollow = async (req, res) => {
  try {
    await followService.acceptFollowRequest(req.user, req.params.id);
    res.json({ message: 'Request accepted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.rejectFollow = async (req, res) => {
  try {
    await followService.rejectFollowRequest(req.user, req.params.id);
    res.json({ message: 'Request rejected' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getFollowers = async (req, res) => {
  try {
    const followers = await followService.getFollowers(req.user, req.params.id);
    res.json({ followers });
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
};

exports.getFollowing = async (req, res) => {
  try {
    const following = await followService.getFollowing(req.user, req.params.id);
    res.json({ following });
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
};

exports.getMutuals = async (req, res) => {
  try {
    const mutuals = await followService.getMutuals(req.user, req.params.id);
    res.json({ mutuals });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.unfollowUser = async (req, res) => {
  try {
    await followService.unfollowUser(req.user, req.params.id);
    res.json({ message: 'Unfollowed successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
