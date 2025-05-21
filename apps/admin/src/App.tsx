import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DashboardLayout from './components/layout/DashboardLayout';
import AuthLayout from './components/layout/AuthLayout';
import { Dashboard } from './pages';
import Login from './pages/Login';
import Users from './pages/Users';
import OtpManagement from './pages/OtpManagement';
import SecurityLogs from './pages/SecurityLogs';
import Settings from './pages/Settings';
import {
  GamingMachineList,
  GamingMachineDetails,
} from './pages/GamingMachines';
import { PlayersList, PlayerDetails } from './pages/Players';
import { CashInsList, CashInDetails } from './pages/CashIns';
import { CoinInsList, CoinInDetails } from './pages/CoinIns';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-background text-text-primary">
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
              <Route path="players" element={<PlayersList />} />
              <Route path="players/:id" element={<PlayerDetails />} />
              <Route path="cash-ins" element={<CashInsList />} />
              <Route path="cash-ins/:id" element={<CashInDetails />} />
              <Route path="otp-management" element={<OtpManagement />} />
              <Route path="security-logs" element={<SecurityLogs />} />
              <Route path="settings" element={<Settings />} />
              <Route path="gaming-machines" element={<GamingMachineList />} />
              <Route
                path="gaming-machines/:id"
                element={<GamingMachineDetails />}
              />
              <Route path="coin-ins" element={<CoinInsList />} />
              <Route path="coin-ins/:id" element={<CoinInDetails />} />
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
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
