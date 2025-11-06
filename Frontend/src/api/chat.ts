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

export const getChatMessages = async (targetId: string, token: string) => {
  try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/messages/${targetId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch chat messages: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    throw error;
  }
};