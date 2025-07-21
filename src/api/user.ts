import axios from 'axios';
import { getToken } from './auth';

const BASE_URL = 'http://20.192.25.27:4242/api';

export async function getOwnUserProfile() {
  const token = getToken();
  const res = await axios.get(`${BASE_URL}/users/userprofile`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });
  return res.data;
}

export async function updateProfile({ username, email, phone, bio }: { username: string; email: string; phone: string; bio: string }) {
  const token = getToken();
  const res = await axios.patch(`${BASE_URL}/users/profile`, { username, email, phone, bio }, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });
  return res.data;
}

export async function updateProfilePicture(file: File) {
  const token = getToken();
  const formData = new FormData();
  formData.append('profilePicture', file);
  const res = await axios.patch(`${BASE_URL}/users/profile-picture`, formData, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });
  return res.data;
}

// --- FOLLOW API ---
export async function sendFollowRequest(targetUserId: string) {
  const token = getToken();
  const res = await axios.post(`${BASE_URL}/follow/${targetUserId}/follow-request`, {}, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });
  return res.data;
}

export async function getFollowRequests() {
  const token = getToken();
  const res = await axios.get(`${BASE_URL}/follow/follow-requests`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });
  return res.data;
}

export async function acceptFollowRequest(targetUserId: string) {
  const token = getToken();
  const res = await axios.post(`${BASE_URL}/follow/${targetUserId}/follow-accept`, {}, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });
  return res.data;
}

export async function rejectFollowRequest(targetUserId: string) {
  const token = getToken();
  const res = await axios.post(`${BASE_URL}/follow/${targetUserId}/follow-reject`, {}, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });
  return res.data;
}

export async function getFollowers(targetUserId: string) {
  const token = getToken();
  const res = await axios.get(`${BASE_URL}/follow/${targetUserId}/followers`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });
  return res.data;
}

export async function getFollowing(targetUserId: string) {
  const token = getToken();
  const res = await axios.get(`${BASE_URL}/follow/${targetUserId}/following`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });
  return res.data;
}

export async function getMutuals(targetUserId: string) {
  const token = getToken();
  const res = await axios.get(`${BASE_URL}/follow/${targetUserId}/mutuals`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });
  return res.data;
}

export async function unfollowUser(targetUserId: string) {
  const token = getToken();
  const res = await axios.post(`${BASE_URL}/follow/${targetUserId}/unfollow`, {}, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });
  return res.data;
}
