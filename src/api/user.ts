import axios from 'axios';
import { getToken } from './auth';


export async function getOwnUserProfile() {
  const token = getToken();
  const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/userprofile`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });
  return res.data;
}

export async function updateProfile({ username, email, phone, bio }: { username: string; email: string; phone: string; bio: string }) {
  const token = getToken();
  const res = await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/users/profile`, { username, email, phone, bio }, {
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
  const res = await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/users/profile-image`, formData, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });
  return res.data;
}

// --- FOLLOW API ---
export async function sendFollowRequest(targetUserId: string) {
  const token = getToken();
  const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/follow/${targetUserId}/follow-request`, {}, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });
  return res.data;
}

export async function getFollowRequests() {
  const token = getToken();
  const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/follow/follow-requests`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });
  return res.data;
}

export async function acceptFollowRequest(targetUserId: string) {
  const token = getToken();
  const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/follow/${targetUserId}/follow-accept`, {}, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });
  return res.data;
}

export async function rejectFollowRequest(targetUserId: string) {
  const token = getToken();
  const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/follow/${targetUserId}/follow-reject`, {}, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });
  return res.data;
}

export async function getFollowers(targetUserId: string) {
  const token = getToken();
  const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/follow/${targetUserId}/followers`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });
  return res.data;
}

export async function getFollowing(targetUserId: string) {
  const token = getToken();
  const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/follow/${targetUserId}/following`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });
  return res.data;
}

export async function getMutuals(targetUserId: string) {
  const token = getToken();
  const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/follow/${targetUserId}/mutuals`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });
  return res.data;
}

export async function followUser(targetUserId: string) {
  const token = getToken()
  const response = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/follow/${targetUserId}/follow-request`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
  return response.data
}

export async function unfollowUser(targetUserId: string) {
  const token = getToken();
  const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/follow/${targetUserId}/unfollow`, {}, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });
  return res.data;
}

export async function getUserProfileById(userId: string) {
  const token = getToken();
  const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/${userId}/profile`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });
  return res.data;
}

export async function getUserByUsername(username: string) {
  const token = getToken();
  const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/username/${username}`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });
  return res.data;
}
