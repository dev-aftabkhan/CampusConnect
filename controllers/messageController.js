const Message = require('../models/Message');

exports.getMessages = async (req, res) => {
  const messages = await Message.find({
    $or: [
      { sender: req.user, receiver: req.params.userId },
      { sender: req.params.userId, receiver: req.user }
    ]
  }).sort({ createdAt: 1 });

  res.json(messages);
}