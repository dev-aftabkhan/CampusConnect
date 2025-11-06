import axios from 'axios';
import type { Notification } from '@/types/notification';

export async function getNotifications(): Promise<Notification[]> {
  return axios.get('/api/notifications');
}

export async function markAsRead(id: string) {
  return axios.post(`/api/notifications/${id}/read`);
}
