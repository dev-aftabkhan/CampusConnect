export interface Notification {
  _id: string;
  type: 'like' | 'comment' | 'follow' | 'message';
  sender: string;
  receiver: string;
  post?: string;
  comment?: string;
  chat?: string;
  createdAt: string;
  read: boolean;
}
