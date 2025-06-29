const User = require('../models/User');
const UserService = require('../services/userService');

exports.sendFollowRequest = async (fromUserId, toUserId) => {
  const receiver = await UserService.findUserById(toUserId);
    if (!receiver) throw new Error('User not found');
  const sender = await UserService.findUserById(fromUserId);
    if (!sender) throw new Error('Sender not found');
  
  console.log("Receiver.followRequests:", receiver?.followRequests);
  console.log("Receiver.followers:", receiver?.follower);

  if (
    receiver.followRequests.includes(fromUserId) ||
    receiver.follower.includes(fromUserId)
  ) throw new Error('Request already sent or already following');

  receiver.followRequests.push(fromUserId);
  await receiver.save();
};
exports.getIncomingRequests = async (userId) => {
  const user = await UserService.findUserById(userId);
  if (!user) throw new Error('User not found');

  const populated = await user.populate({path: 'followRequestsInfo', select: 'username profilePicture bio interests'});
  return populated.followRequestsInfo;
};


exports.acceptFollowRequest = async (userId, fromUserId) => {
  const user = await UserService.findUserById(userId);
  const fromUser = await UserService.findUserById(fromUserId);
  if (!user || !fromUser) throw new Error('User not found');

  if (!user.followRequests.includes(fromUserId)) throw new Error('No such follow request');

  user.followRequests.pull(fromUserId);
  user.follower.push(fromUserId);
  fromUser.following.push(userId);

  await user.save();
  await fromUser.save();
};

exports.rejectFollowRequest = async (userId, fromUserId) => {
  const user = await UserService.findUserById(userId);
  if (!user) throw new Error('User not found');

  if (!user.followRequests.includes(fromUserId)) throw new Error('No such follow request');

  user.followRequests.pull(fromUserId);
  await user.save();
};

exports.getFollowers = async (viewerId, targetId) => {
  const viewer = await UserService.findUserById(viewerId);

  // get the full target with populated followers
  const target = await User.findOne({ user_id: targetId })
    .populate('followerInfo', 'username profilePicture bio interests');

  if (!viewer || !target) throw new Error('User not found');

  // Access control: must be in target.follower[] (raw strings)
  const isAllowed = target.follower.includes(viewerId)|| target.user_id === viewerId;
  if (!isAllowed) throw new Error('Access denied');

  return target.followerInfo;
};

exports.getFollowing = async (viewerId, targetId) => {
  const viewer = await UserService.findUserById(viewerId);
 // get the full target with populated followers
  const target = await User.findOne({ user_id: targetId })
    .populate('followingInfo', 'username profilePicture bio interests');

  if (!viewer || !target) throw new Error('User not found');
 // Access control: must be in target.follower[] (raw strings)
  const isAllowed = target.follower.includes(viewerId)|| target.user_id === viewerId;
  if (!isAllowed) throw new Error('Access denied');
  return target.followingInfo;
};

exports.getMutuals = async (viewerId, targetId) => {
  const viewer = await User.findOne({ user_id: viewerId })
    .populate('followerInfo', 'username profilePicture bio interests');
  const target = await User.findOne({ user_id: targetId })
    .populate('followerInfo', 'username profilePicture bio interests');

  const viewerFollows = viewer.followerInfo.map(user => user.user_id.toString());
  const targetFollows = target.followerInfo.map(user => user.user_id.toString());
  const mutualIds = viewerFollows.filter(id => targetFollows.includes(id));

  return await User.find({ user_id: { $in: mutualIds } }, 'username email profilePicture');
};
