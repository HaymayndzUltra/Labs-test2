import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

type TokenResolver = () => string | null | undefined;
type UnauthorizedHandler = (error: AxiosError) => void | Promise<void>;

let tokenResolver: TokenResolver | null = null;
let unauthorizedHandler: UnauthorizedHandler | null = null;

export const setTokenResolver = (resolver: TokenResolver | null) => {
  tokenResolver = resolver;
};

export const setUnauthorizedHandler = (handler: UnauthorizedHandler | null) => {
  unauthorizedHandler = handler;
};

const getTokenFromLocalStorage = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return window.localStorage?.getItem('auth_token') ?? null;
  } catch (error) {
    console.warn('Unable to read auth token from localStorage.', error);
    return null;
  }
};

const getTokenFromCookies = (): string | null => {
  if (typeof window !== 'undefined') {
    return null;
  }

  try {
    const { cookies } = require('next/headers') as typeof import('next/headers');
    return cookies().get('auth_token')?.value ?? null;
  } catch {
    return null;
  }
};

const resolveAuthToken = (): string | null => {
  const providedToken = tokenResolver?.() ?? null;
  if (providedToken) {
    return providedToken;
  }

  return getTokenFromLocalStorage() ?? getTokenFromCookies();
};

const handleUnauthorized = async (error: AxiosError) => {
  if (unauthorizedHandler) {
    await unauthorizedHandler(error);
    return;
  }

  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage?.removeItem('auth_token');
  } catch (storageError) {
    console.warn('Unable to clear auth token from localStorage.', storageError);
  }

  try {
    const routerModule = await import('next/router');
    routerModule.default?.push?.('/login');
    return;
  } catch {
    // Fallback to window navigation below.
  }

  window.location.href = '/login';
};

// Request interceptor for auth
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = resolveAuthToken();
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      await handleUnauthorized(error);
    }
    return Promise.reject(error);
  }
);

// API helper functions
export const apiHelpers = {
  get: <T>(url: string, params?: any) => api.get<T>(url, { params }),
  post: <T>(url: string, data?: any) => api.post<T>(url, data),
  put: <T>(url: string, data?: any) => api.put<T>(url, data),
  patch: <T>(url: string, data?: any) => api.patch<T>(url, data),
  delete: <T>(url: string) => api.delete<T>(url),
};