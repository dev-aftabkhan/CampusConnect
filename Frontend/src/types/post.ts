export interface Comment {
  _id: string;
  post: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface Post {
  _id: string;
  author: string;
  content: string;
  image?: string;
  likes: string[];
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}
