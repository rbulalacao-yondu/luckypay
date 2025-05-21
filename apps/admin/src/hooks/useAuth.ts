import { useState, useCallback, useEffect } from 'react';
import api from '../services/api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthResponse {
  accessToken: string;
  user: User;
}

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Try to load user from localStorage on initial mount
    try {
      const storedUserStr = localStorage.getItem('admin_user');
      const storedToken = localStorage.getItem('admin_token');
      if (storedUserStr && storedToken) {
        const user: User = JSON.parse(storedUserStr);
        if (user && user.role.toLowerCase() === 'admin') {
          setCurrentUser(user);
          console.log('Auth state initialized from localStorage:', user);
        }
      }
    } catch (e) {
      console.error('Failed to parse user from localStorage', e);
      localStorage.removeItem('admin_user');
      localStorage.removeItem('admin_token');
    }
    setIsInitialized(true);
  }, []);

  const isAuthenticated = useCallback(() => {
    const token = localStorage.getItem('admin_token');
    // Check both currentUser state and token presence
    return (
      !!token && !!currentUser && currentUser.role.toLowerCase() === 'admin'
    );
  }, [currentUser]);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await api.post<AuthResponse>(
        '/auth/admin/login',
        credentials,
      );

      if (!data.accessToken || !data.user) {
        throw new Error('Invalid response from server');
      }

      // Ensure the user data has the expected format
      console.log('Raw login response:', data);

      localStorage.setItem('admin_token', data.accessToken);
      localStorage.setItem('admin_user', JSON.stringify(data.user));
      setCurrentUser(data.user); // Update React state
      console.log('Login successful, currentUser set:', data.user);
      return data;
    } catch (err: any) {
      console.error('Login error:', err);
      const errorMessage =
        err.response?.data?.message || err.message || 'Failed to login';
      setError(errorMessage);
      localStorage.removeItem('admin_token'); // Clear potentially bad token
      localStorage.removeItem('admin_user');
      setCurrentUser(null);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await api.post('/auth/admin/logout');
    } catch (e) {
      console.error('Logout API call failed', e);
      // Proceed with local logout anyway
    } finally {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      setCurrentUser(null); // Clear React state
      setIsLoading(false);
      window.location.href = '/login'; // Force redirect
    }
  }, []);

  return {
    isLoading,
    error,
    isInitialized,
    currentUser,
    login,
    logout,
    isAuthenticated,
  };
}
