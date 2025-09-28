'use client';

import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = window.localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== 'undefined' && error.response?.status === 401) {
      window.localStorage.removeItem('auth_token');
    }
    return Promise.reject(error);
  }
);

export const apiHelpers = {
  get: <T>(url: string, params?: any) => api.get<T>(url, { params }),
  post: <T>(url: string, data?: any) => api.post<T>(url, data),
  patch: <T>(url: string, data?: any) => api.patch<T>(url, data),
};

export async function fetcher<T>(url: string): Promise<T> {
  const response = await api.get<T>(url);
  return response.data;
}

export function resolvedApiUrl(path: string): string {
  return `${API_BASE_URL}${path}`;
}
