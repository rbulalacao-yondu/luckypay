import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import DashboardLayout from './components/layout/DashboardLayout';
import AuthLayout from './components/layout/AuthLayout';
import { Dashboard } from './pages';
import Login from './pages/Login';
import Users from './pages/Users';
import OtpManagement from './pages/OtpManagement';
import SecurityLogs from './pages/SecurityLogs';

const queryClient = new QueryClient();

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />

              {/* Protected routes with nested layout */}
              <Route
                path="/"
                element={
                  <AuthLayout>
                    <DashboardLayout />
                  </AuthLayout>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="users" element={<Users />} />
                <Route path="otp-management" element={<OtpManagement />} />
                <Route path="security-logs" element={<SecurityLogs />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>

              {/* Fallback direct route to dashboard that bypasses layouts for debugging */}
              <Route
                path="/direct-dashboard"
                element={
                  <AuthLayout>
                    <Dashboard />
                  </AuthLayout>
                }
              />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </LocalizationProvider>
    </QueryClientProvider>
  );
}

export default App;
