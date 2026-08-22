export interface User {
  _id: string;
  username: string;
  email: string;
}

export interface Tag {
  _id: string;
  name: string;
}

export interface Bookmark {
  _id: string;
  title: string;
  url: string;
  description: string;
  tags: Tag[];
  user: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  _id: string;
  username: string;
  email: string;
  token: string;
}

export interface CreateBookmarkPayload {
  title: string;
  url: string;
  description?: string;
  tags?: string[];
}
