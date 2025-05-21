import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useAuth } from '../hooks';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, isAuthenticated } = useAuth();
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    const checkAuth = () => {
      const isAuth = isAuthenticated();
      console.log('Login page auth check:', { isAuth });
      console.log('Token:', localStorage.getItem('admin_token'));
      console.log('User:', localStorage.getItem('admin_user'));
      if (isAuth) {
        const from = location.state?.from?.pathname || '/';
        console.log('Redirecting to:', from);
        navigate(from, { replace: true });
      }
    };
    checkAuth();
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await login(credentials);
      console.log('Login successful:', result);
      console.log('User details from response:', result.user);

      // Force a check of authentication state immediately after updating localStorage
      const isAuth = isAuthenticated();
      console.log('Authentication status after login:', isAuth);

      // First try to navigate directly
      if (isAuth) {
        console.log('Authenticated - redirecting to dashboard');
        navigate('/', { replace: true });
        return;
      }

      // If immediate check fails, try with user data from response
      // This handles the case where React state hasn't updated yet but we have valid data
      if (result.user && result.user.role && result.accessToken) {
        console.log('Response contains valid user data, attempting navigation');
        navigate('/', { replace: true });
        return;
      }

      // Last resort: try direct route with delay
      console.log('Trying fallback route with delay');
      setTimeout(() => {
        navigate('/direct-dashboard', { replace: true });
      }, 500);
    } catch (err) {
      console.error('Login submission error:', err);
      // Error is handled by the hook
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'grey.100',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 400,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Admin Login
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={credentials.email}
            onChange={handleChange}
            disabled={isLoading}
          />
          <TextField
            fullWidth
            type="password"
            label="Password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            disabled={isLoading}
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isLoading}
            sx={{ mt: 2 }}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Login'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
