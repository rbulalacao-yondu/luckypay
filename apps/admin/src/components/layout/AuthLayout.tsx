import { Navigate, useLocation } from 'react-router-dom';
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
  console.log('Token:', localStorage.getItem('admin_token'));
  console.log('User:', localStorage.getItem('admin_user'));

  // Don't make any decisions until we've initialized
  if (!isInitialized) {
    console.log('Auth not initialized yet, showing loading state');
    return null;
  }

  if (!authStatus) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log('Authenticated, rendering protected content');
  return <>{children}</>;
}
