import axios from 'axios';
import type { User } from '@/types/user';
import { getToken } from './auth';

export async function getUserById(id: string): Promise<User> {
  return axios.get(`/api/users/${id}`);
}

export async function updateProfile(data: Partial<User>) {
  return axios.put('/api/users/me', data);
}

export async function followUser(userId: string) {
  return axios.post(`/api/users/${userId}/follow`);
}

export async function unfollowUser(userId: string) {
  return axios.post(`/api/users/${userId}/unfollow`);
}

export async function getUserProfile(id: string) {
  const token = getToken();
  const res = await axios.get(`http://20.192.25.27:4242/api/user/${id}/profile`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });
  return res.data;
}
