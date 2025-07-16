import axios from 'axios';
import type { Post } from '@/types/post';

export async function getFeedPosts(): Promise<Post[]> {
  return axios.get('/api/posts');
}

export async function createPost(data: Partial<Post>) {
  return axios.post('/api/posts', data);
}

export async function updatePost(id: string, data: Partial<Post>) {
  return axios.put(`/api/posts/${id}`, data);
}

export async function deletePost(id: string) {
  return axios.delete(`/api/posts/${id}`);
}

export async function likePost(id: string) {
  return axios.post(`/api/posts/${id}/like`);
}

export async function commentOnPost(id: string, content: string) {
  return axios.post(`/api/posts/${id}/comments`, { content });
}
