const Message = require('../models/Message');

exports.getMessages = async (req, res) => {
  const messages = await Message.find({
    $or: [
      { sender: req.user, receiver: req.params.userId },
      { sender: req.params.userId, receiver: req.user }
    ]
  }).sort({ createdAt: 1 });

  res.json(messages);
};

exports.chathistory = async (req, res) => {
  const { partnerId } = req.params;

  const user = await User.findOne({ user_id: req.user });
  const partner = await User.findOne({ user_id: partnerId });

  const isMutual = user.following.includes(partnerId) && partner.following.includes(req.user);
  if (!isMutual) return res.status(403).json({ message: 'Chat not allowed' });

  const messages = await Message.find({
    $or: [
      { sender: req.user, receiver: partnerId },
      { sender: partnerId, receiver: req.user }
    ]
  }).sort({ createdAt: 1 });

  res.json(messages);
};