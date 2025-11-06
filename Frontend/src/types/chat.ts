export interface Message {
  _id: string;
  sender: string;
  content: string;
  createdAt: string;
}

export interface Chat {
  _id: string;
  participants: string[];
  messages: Message[];
  updatedAt: string;
}
