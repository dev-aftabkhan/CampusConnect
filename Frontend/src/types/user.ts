export interface User {
  _id: string;
  username: string;
  email: string;
  bio?: string;
  profilePicture?: string;
  followers: string[];
  following: string[];
  interests?: string[];
  createdAt: string;
  updatedAt: string;
}
