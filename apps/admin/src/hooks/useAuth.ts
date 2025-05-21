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

// Convert backend roles to a normalized format
const normalizeRole = (role: string): string => {
  const roleStr = String(role).toLowerCase();
  if (roleStr === 'super_admin') return 'super_admin';
  if (roleStr.includes('admin')) return 'admin';
  return roleStr;
};

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
        if (user && user.role) {
          // Normalize the role for consistency
          const normalizedRole = normalizeRole(user.role);
          console.log(
            'Stored user role:',
            user.role,
            'Normalized:',
            normalizedRole,
          );

          // Check if role grants admin access
          if (normalizedRole === 'super_admin' || normalizedRole === 'admin') {
            // Update the user with normalized role
            const normalizedUser = { ...user, role: normalizedRole };
            setCurrentUser(normalizedUser);
            console.log(
              'Auth state initialized from localStorage:',
              normalizedUser,
            );

            // Update localStorage with normalized role if needed
            if (user.role !== normalizedRole) {
              localStorage.setItem(
                'admin_user',
                JSON.stringify(normalizedUser),
              );
              console.log('Updated localStorage with normalized role');
            }
          } else {
            console.warn(
              'User role not sufficient for admin access:',
              user.role,
            );
          }
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
    try {
      const token = localStorage.getItem('admin_token');
      const userStr = localStorage.getItem('admin_user');

      // If no token or no user data, not authenticated
      if (!token || !userStr) {
        console.log('No token or user data found');
        return false;
      }

      // Parse and validate user data
      const user = JSON.parse(userStr);
      if (!user) {
        console.log('Invalid user data', user);
        return false;
      }

      // Handle case where role might be missing or null
      if (!user.role) {
        console.warn('User has no role specified:', user);
        return false;
      }

      // Normalize the role for consistent checking
      const normalizedRole = normalizeRole(user.role);
      console.log('User role:', user.role, 'Normalized role:', normalizedRole);

      // Check if user has admin permissions
      const hasAdminAccess =
        normalizedRole === 'super_admin' || normalizedRole === 'admin';

      console.log('User has admin access:', hasAdminAccess);
      return hasAdminAccess;
    } catch (error) {
      console.error('Error in isAuthenticated check:', error);
      return false;
    }
  }, []);
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

      // Log the entire response for debugging
      console.log('Raw login response:', data);

      // Decode the JWT token to log the payload
      try {
        const payload = data.accessToken.split('.')[1];
        const decodedData = JSON.parse(atob(payload));
        console.log('Decoded JWT payload:', decodedData);
      } catch (decodeError) {
        console.error('Could not decode JWT', decodeError);
      }

      // Ensure user has role property, default to 'admin' if missing
      if (!data.user.role) {
        console.warn('User object missing role, setting default role "admin"');
        data.user.role = 'admin';
      }

      // Normalize the role to ensure consistent role checks
      const normalizedUserData = {
        ...data.user,
        role: normalizeRole(data.user.role),
      };

      console.log('Normalized user data:', normalizedUserData);

      // Store token and normalized user data in localStorage
      localStorage.setItem('admin_token', data.accessToken);
      localStorage.setItem('admin_user', JSON.stringify(normalizedUserData));

      // Update React state
      setCurrentUser(normalizedUserData);

      console.log('Login successful, data stored:', {
        token: `${data.accessToken.substring(0, 10)}...`,
        user: normalizedUserData,
      });

      return data;
    } catch (err: any) {
      console.error('Login error:', err);

      // Clear any existing data
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      setCurrentUser(null);

      const errorMessage =
        err.response?.data?.message || err.message || 'Failed to login';
      setError(errorMessage);

      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      // Try to call the logout API
      await api.post('/auth/admin/logout');
      console.log('Logout API call successful');
    } catch (e) {
      console.error('Logout API call failed', e);
      // Proceed with local logout anyway
    } finally {
      // Always clear local storage and state
      console.log('Clearing auth data and redirecting to login');
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      setCurrentUser(null); // Clear React state
      setIsLoading(false);

      // Force a page reload to clear any cached state
      window.location.href = '/login';
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
