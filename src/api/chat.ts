import axios from 'axios';
import type { Chat } from '@/types/chat';

export async function getChats(): Promise<Chat[]> {
  return axios.get('/api/chats');
}

export async function sendMessage(chatId: string, content: string) {
  return axios.post(`/api/chats/${chatId}/messages`, { content });
}

export async function createChat(participants: string[]) {
  return axios.post('/api/chats', { participants });
}
