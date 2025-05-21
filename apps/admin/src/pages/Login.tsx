import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, isAuthenticated, isInitialized } = useAuth();
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
        console.log('Already authenticated, redirecting to:', from);
        navigate(from, { replace: true });
      } else {
        // Only clear tokens if auth check fails
        console.log('Not authenticated, clearing tokens');
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
      }
    };

    // Only check auth if we're initialized
    if (isInitialized) {
      checkAuth();
    }
  }, [isAuthenticated, isInitialized, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await login(credentials);
      console.log('Login successful:', result);

      // Manually store data to ensure it's properly set
      if (result.accessToken && result.user) {
        console.log('Setting authentication data manually');
        localStorage.setItem('admin_token', result.accessToken);
        localStorage.setItem('admin_user', JSON.stringify(result.user));

        // Use a short delay to ensure localStorage is updated
        setTimeout(() => {
          console.log('Navigating to dashboard after delay');
          navigate('/', { replace: true });
        }, 300);
      } else {
        console.error('Invalid login response data', result);
      }
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              LuckyPay Admin
            </h1>
            <p className="text-gray-500">Sign in to your admin account</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200 mb-6 flex items-center">
              <svg
                className="w-5 h-5 mr-2 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 01-1-1v-4a1 1 0 112 0v4a1 1 0 01-1 1z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <label
                htmlFor="email"
                className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-primary transition-all"
                style={{ fontWeight: 600 }}
              >
                Email Address
              </label>
              <input
                id="email"
                className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                name="email"
                type="email"
                value={credentials.email}
                onChange={handleChange}
                disabled={isLoading}
                required
                placeholder="name@company.com"
              />
            </div>

            <div className="relative">
              <label
                htmlFor="password"
                className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-primary transition-all"
                style={{ fontWeight: 600 }}
              >
                Password
              </label>
              <input
                id="password"
                className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                disabled={isLoading}
                required
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-600"
                >
                  Remember me
                </label>
              </div>

              <a
                href="#"
                className="text-sm text-primary hover:text-primary-dark"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full h-12 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors duration-300 flex items-center justify-center"
              style={{ fontWeight: 600 }}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
        <div className="text-center mt-4 text-gray-600 text-sm">
          &copy; 2025 LuckyPay. All rights reserved.
        </div>
      </div>
    </div>
  );
}
