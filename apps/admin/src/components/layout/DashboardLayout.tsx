import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks';
import {
  Bars3Icon,
  ChevronLeftIcon,
  HomeIcon,
  UsersIcon,
  ShieldCheckIcon,
  KeyIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

const menuItems = [
  { text: 'Dashboard', icon: HomeIcon, path: '/' },
  { text: 'Users', icon: UsersIcon, path: '/users' },
  { text: 'OTP Management', icon: KeyIcon, path: '/otp-management' },
  { text: 'Security Logs', icon: ShieldCheckIcon, path: '/security-logs' },
  { text: 'Settings', icon: Cog6ToothIcon, path: '/settings' },
];

export default function DashboardLayout() {
  const [open, setOpen] = useState(true);
  const { logout, currentUser } = useAuth();
  const user = currentUser;

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Top Navigation Bar */}
      <div
        className={`fixed top-0 left-0 right-0 bg-primary text-white z-10 transition-all duration-300 ${
          open ? 'ml-[240px]' : 'ml-16'
        }`}
      >
        <div className="flex items-center justify-between px-4 h-16">
          <div className="flex items-center">
            <button
              className={`text-white p-2 rounded-md hover:bg-primary-dark ${
                open ? 'hidden' : 'block'
              }`}
              onClick={handleDrawerOpen}
              aria-label="open drawer"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-medium ml-2">LuckyPay Admin</h1>
          </div>

          {user && (
            <div className="flex items-center gap-4">
              <span className="text-sm">{user.email}</span>
              <button
                className="flex items-center gap-1 text-sm bg-primary-dark px-3 py-1 rounded hover:bg-primary-light"
                onClick={handleLogout}
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 transition-all duration-300 shadow-md ${
          open ? 'w-[240px]' : 'w-16'
        }`}
      >
        <div className="flex justify-end p-4 border-b border-gray-200">
          <button
            onClick={handleDrawerClose}
            className="p-1 rounded-full hover:bg-gray-200"
          >
            <ChevronLeftIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <nav className="mt-5">
          <ul>
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.text}>
                  <Link
                    to={item.path}
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100"
                  >
                    <Icon className={`h-5 w-5 ${!open && 'mx-auto'}`} />
                    {open && <span className="ml-3">{item.text}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 overflow-auto ${
          open ? 'ml-[240px]' : 'ml-16'
        } mt-16`}
      >
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
