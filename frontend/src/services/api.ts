import axios from 'axios';
import type { AuthResponse, Bookmark, CreateBookmarkPayload } from '../types';

// Axios instance — Vite proxy handles /api → http://localhost:3001
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Bearer token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('linkvault_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Auth ────────────────────────────────────────────

export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/auth/login', {
    email,
    password,
  });
  return data;
};

export const registerUser = async (
  username: string,
  email: string,
  password: string
): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/auth/register', {
    username,
    email,
    password,
  });
  return data;
};

export const getMe = async (): Promise<AuthResponse> => {
  const { data } = await api.get<AuthResponse>('/auth/me');
  return data;
};

// ─── Bookmarks ───────────────────────────────────────

export const getBookmarks = async (): Promise<Bookmark[]> => {
  const { data } = await api.get<Bookmark[]>('/bookmarks');
  return data;
};

export const createBookmark = async (
  payload: CreateBookmarkPayload
): Promise<Bookmark> => {
  const { data } = await api.post<Bookmark>('/bookmarks', payload);
  return data;
};

export const deleteBookmark = async (id: string): Promise<void> => {
  await api.delete(`/bookmarks/${id}`);
};

export const searchBookmarks = async (query: string): Promise<Bookmark[]> => {
  const { data } = await api.get<Bookmark[]>('/bookmarks/search', {
    params: { q: query },
  });
  return data;
};

export default api;
