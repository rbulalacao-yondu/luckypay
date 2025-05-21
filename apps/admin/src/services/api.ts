import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
}); // Add request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;

      // Log detailed info about the request
      const endpoint = config.url || 'unknown endpoint';
      const method = config.method?.toUpperCase() || 'unknown method';

      console.log(`API Request: ${method} ${endpoint}`, {
        tokenLength: token.length,
        tokenPreview: `${token.substring(0, 15)}...`,
        headers: {
          'Content-Type': config.headers['Content-Type'],
          Authorization: `Bearer ${token.substring(0, 10)}...`,
        },
      });

      // Add additional debug info if this is a problematic endpoint
      if (endpoint.includes('users') || endpoint.includes('security-logs')) {
        console.log('Detailed auth info for sensitive endpoint:', {
          url: endpoint,
          method,
          userStr: localStorage.getItem('admin_user'),
          tokenValid: token.split('.').length === 3, // Basic JWT structure check
        });

        // Decode and log JWT payload for debugging
        try {
          const payload = token.split('.')[1];
          const decodedToken = JSON.parse(atob(payload));
          console.log('Decoded JWT token for debugging:', {
            subject: decodedToken.sub,
            role: decodedToken.role,
            email: decodedToken.email,
            exp: new Date(decodedToken.exp * 1000).toLocaleString(),
            iat: new Date(decodedToken.iat * 1000).toLocaleString(),
          });
        } catch (e) {
          console.error('Error decoding JWT token:', e);
        }
      }
    } else {
      console.warn('API Request without token:', {
        url: config.url,
        method: config.method,
      });
    }
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
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
      message: error.message,
    });

    // Handle authentication errors (401 Unauthorized or 403 Forbidden)
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.warn('Authentication error detected', {
        status: error.response.status,
        url: error.config.url,
        currentPath: window.location.pathname,
      });

      // Only redirect to login if we're not already on the login page
      // This prevents redirect loops
      if (!window.location.pathname.includes('/login')) {
        console.log('Redirecting to login due to auth error');
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        window.location.href = '/login';
      }
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
  settings: {
    get: '/admin/settings',
    update: '/admin/settings',
  },
};
