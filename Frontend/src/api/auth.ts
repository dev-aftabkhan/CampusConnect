import axios from 'axios';
import type { User } from '@/types/user';

// Always send cookies with requests
axios.defaults.withCredentials = true;

export async function login(identifier: string, password: string) {
  if (!identifier || !password) {
    throw new Error('Identifier and password are required');
  }
  // Login and get token + user
  const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, { identifier, password }, {
    headers: { 'Content-Type': 'application/json' }
  });
  const { token, user } = res.data;
  if (token) {
    localStorage.setItem('token', token);
  }
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  }
  return user;
}

// Helper to get token from localStorage
export function getToken() {
  return localStorage.getItem('token');
}

export async function register(username: string, email: string, phone: string, password: string) {
  return axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/register`, { username, email, phone, password }, {
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' }
  });
}

// Update getCurrentUser to use token if present
export async function getCurrentUser(): Promise<User | null> {
  const token = getToken();
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/userprofile`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    return res.data.user as User;
  } catch {
    return null;
  }
}

export async function logout() {
  return axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/logout`, {}, {
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' }
  });
}