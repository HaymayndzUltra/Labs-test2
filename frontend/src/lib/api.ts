import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth and tenant context
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      const tenantId = localStorage.getItem('active_tenant_id');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      if (tenantId) {
        config.headers['X-Tenant-ID'] = tenantId;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and session hydration
api.interceptors.response.use(
  (response) => {
    if (
      typeof window !== 'undefined' &&
      response.config.url?.includes('/login/access-token') &&
      response.data
    ) {
      const { access_token, tenant_id, tenant_role } = response.data;
      if (access_token) {
        localStorage.setItem('auth_token', access_token);
      }
      if (tenant_id) {
        localStorage.setItem('active_tenant_id', String(tenant_id));
      }
      if (tenant_role) {
        localStorage.setItem('tenant_role', tenant_role);
      }
    }
    return response;
  },
  async (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      // Handle unauthorized access
      localStorage.removeItem('auth_token');
      localStorage.removeItem('active_tenant_id');
      localStorage.removeItem('tenant_role');
      window.location.href = '/login';
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
