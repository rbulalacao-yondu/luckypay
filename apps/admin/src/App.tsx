import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import DashboardLayout from './components/layout/DashboardLayout';
import { Dashboard } from './pages';

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
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route
                path="users"
                element={<div>Users Page (Coming Soon)</div>}
              />
              <Route
                path="security-logs"
                element={<div>Security Logs (Coming Soon)</div>}
              />
              <Route
                path="loyalty"
                element={<div>Loyalty Program (Coming Soon)</div>}
              />
              <Route
                path="settings"
                element={<div>Settings (Coming Soon)</div>}
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
