import axios from 'axios';
import type { User } from '@/types/user';

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
