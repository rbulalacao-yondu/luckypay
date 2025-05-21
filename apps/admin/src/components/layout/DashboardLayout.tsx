import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
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
  BellIcon,
  UserCircleIcon,
  MoonIcon,
  ComputerDesktopIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline';

const menuItems = [
  { text: 'Dashboard', icon: HomeIcon, path: '/' },
  { text: 'Users', icon: UsersIcon, path: '/users' },
  { text: 'Players', icon: UsersIcon, path: '/players' },
  {
    text: 'Gaming Machines',
    icon: ComputerDesktopIcon,
    path: '/gaming-machines',
  },
  { text: 'OTP Management', icon: KeyIcon, path: '/otp-management' },
  { text: 'Security Logs', icon: ShieldCheckIcon, path: '/security-logs' },
  { text: 'Cash-Ins', icon: BanknotesIcon, path: '/cash-ins' },
  { text: 'Settings', icon: Cog6ToothIcon, path: '/settings' },
];

export default function DashboardLayout() {
  const [open, setOpen] = useState(true);
  const { logout, currentUser } = useAuth();
  const user = currentUser;
  const location = useLocation();

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
    <div className="flex h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div
        className={`fixed top-0 left-0 right-0 bg-white text-gray-800 z-10 transition-all duration-300 shadow-md ${
          open ? 'ml-[240px]' : 'ml-16'
        }`}
      >
        <div className="flex items-center justify-between px-4 h-16">
          <div className="flex items-center">
            <button
              className={`text-gray-500 p-2 rounded-md hover:bg-gray-100 ${
                open ? 'hidden' : 'block'
              }`}
              onClick={handleDrawerOpen}
              aria-label="open drawer"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-medium ml-2 text-primary">
              LuckyPay Admin
            </h1>
          </div>

          {user && (
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                <BellIcon className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                <MoonIcon className="h-5 w-5" />
              </button>
              <div className="flex items-center">
                <UserCircleIcon className="h-8 w-8 text-gray-500 mr-2" />
                <span className="text-sm font-medium">{user.email}</span>
              </div>
              <button
                className="flex items-center gap-1 text-sm bg-red-50 text-red-600 px-3 py-1.5 rounded-md hover:bg-red-100 transition-colors"
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
        className={`fixed top-0 left-0 h-full bg-primary text-white transition-all duration-300 ${
          open ? 'w-[240px]' : 'w-16'
        }`}
      >
        <div className="flex justify-between items-center p-4">
          {open && <span className="font-bold text-lg">LuckyPay</span>}
          <button
            onClick={handleDrawerClose}
            className={`p-1 rounded-full hover:bg-primary-dark ${!open && 'hidden'}`}
          >
            <ChevronLeftIcon className="h-5 w-5 text-white" />
          </button>
        </div>

        <nav className="mt-6">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <li key={item.text}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-3 transition-colors ${
                      isActive
                        ? 'bg-primary-dark text-white'
                        : 'text-white/80 hover:bg-primary-dark hover:text-white'
                    }`}
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
        } mt-16 py-6 px-8`}
      >
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
