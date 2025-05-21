import { useState, useCallback } from 'react';
import api from '../services/api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await api.post<AuthResponse>(
        '/auth/admin/login',
        credentials,
      );
      localStorage.setItem('admin_token', data.accessToken);
      localStorage.setItem('admin_user', JSON.stringify(data.user));
      return data;
    } catch (err: Error | unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to login';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/admin/logout');
    } finally {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      window.location.href = '/login';
    }
  }, []);

  const getUser = useCallback(() => {
    const userStr = localStorage.getItem('admin_user');
    return userStr ? JSON.parse(userStr) : null;
  }, []);

  const isAuthenticated = useCallback(() => {
    return !!localStorage.getItem('admin_token');
  }, []);

  return {
    login,
    logout,
    getUser,
    isAuthenticated,
    isLoading,
    error,
  };
}
