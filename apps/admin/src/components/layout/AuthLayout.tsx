import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '../../hooks';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const { isAuthenticated, isInitialized } = useAuth();
  const location = useLocation();
  const authStatus = isAuthenticated();

  console.log(
    'AuthLayout check - initialized:',
    isInitialized,
    'authenticated:',
    authStatus,
  );
  console.log('Current location:', location.pathname);

  // Additional details for debugging
  const token = localStorage.getItem('admin_token');
  const userStr = localStorage.getItem('admin_user');

  console.log('Token exists:', !!token, 'length:', token?.length || 0);
  console.log('User data exists:', !!userStr);

  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      console.log('User role:', user.role);
    } catch (e) {
      console.error('Failed to parse user data:', e);
    }
  }

  // Show loading indicator while initializing
  if (!isInitialized) {
    console.log('Auth not initialized yet, showing loading state');
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Redirect to login if not authenticated
  if (!authStatus) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log('Authenticated, rendering protected content');
  return <>{children}</>;
}
