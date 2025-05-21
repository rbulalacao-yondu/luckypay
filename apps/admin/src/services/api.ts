import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Add response interceptor for error handling and debugging
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  async (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
    });
    if (error.response?.status === 401) {
      // Handle token expiration
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default api;

// API endpoints
export const endpoints = {
  auth: {
    login: '/auth/admin/login',
    logout: '/auth/admin/logout',
  },
  users: {
    list: '/admin/users',
    getById: (id: string) => `/admin/users/${id}`,
    update: (id: string) => `/admin/users/${id}`,
  },
  securityLogs: {
    list: '/admin/security-logs',
  },
  loyalty: {
    settings: '/admin/loyalty/settings',
    updateSettings: '/admin/loyalty/settings',
  },
};
