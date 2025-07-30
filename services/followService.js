const User = require('../models/User');
const UserService = require('../services/userService');
const { triggerNotification } = require('../sockets/notificationSocket');


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
  sender.pendingRequests.push(toUserId);
  await sender.save();

  // 🔔 Trigger follow request notification
  await triggerNotification({
    user: toUserId,
    type: 'follow_request',
    from: fromUserId
  });
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
  console.log("user.followRequests after pull:", user.followRequests, userId);
  await user.save();
  fromUser.pendingRequests.pull(userId);
  console.log("fromUser.pendingRequests after pull:", fromUser.pendingRequests, fromUserId);
  await fromUser.save();
  user.follower.push(fromUserId);
  console.log("user.follower after push:", user.follower, userId);
  await user.save();
  fromUser.following.push(userId);
  console.log("fromUser.following after push:", fromUser.following, fromUserId);
  await fromUser.save();
  if(!user.following.includes(fromUserId)){
     console.log("Sent follow request from", userId, "to", fromUserId);
    this.sendFollowRequest(userId, fromUserId);
  }
  await user.save();
  await fromUser.save();
};

exports.rejectFollowRequest = async (userId, fromUserId) => {
  const user = await UserService.findUserById(userId);
  const fromUser = await UserService.findUserById(fromUserId);
  if (!user) throw new Error('User not found');

  if (!user.followRequests.includes(fromUserId)) throw new Error('No such follow request');

  user.followRequests.pull(fromUserId);
  user.following.pull(fromUserId);
  await user.save();
  fromUser.pendingRequests.pull(userId);
  fromUser.follower.pull(userId);
  await fromUser.save();

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

exports.unfollowUser = async (userId, targetId) => {
  const currentUser = await User.findOne({ user_id: userId });
  const targetUser = await User.findOne({ user_id: targetId });

  if (!currentUser || !targetUser) throw new Error('User not found');

  if (!currentUser.following.includes(targetUser.user_id)) {
    throw new Error('You are not following this user');
  }

  // Remove the relationship
  currentUser.following.pull(targetUser.user_id);
  targetUser.follower.pull(currentUser.user_id);

  await currentUser.save();
  await targetUser.save();
};

// check the status of a follow request by using pendingRequests, followers, and following arrays
exports.checkFollowStatus = async (userId, targetId) => {
  const user = await UserService.findUserById(userId);
  const target = await UserService.findUserById(targetId);

  if(user.follower.includes(target.user_id) && user.following.includes(target.user_id)){
    return 'connected';
  }
  if (user.pendingRequests.includes(target.user_id)) {
    return 'Requested';
  }
  if(user.followRequests.includes(target.user_id) || target.pendingRequests.includes(user.user_id)){
    return 'incoming request';
  }
  return 'not following';
};

