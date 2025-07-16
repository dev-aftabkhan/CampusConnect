import axios from 'axios';
import type { User } from '@/types/user';

export async function login(identifier: string, password: string) {
  return axios.post('/api/auth/login', { identifier, password });
}

export async function register(username: string, email: string, phone: string, password: string) {
  return axios.post('/api/auth/register', { username, email, phone, password });
}

export async function getCurrentUser(): Promise<User> {
  return axios.get('/api/auth/me');
}

export async function logout() {
  return axios.post('/api/auth/logout');
}
