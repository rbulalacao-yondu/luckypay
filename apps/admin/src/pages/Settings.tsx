import { useState, useEffect } from 'react';
import api, { endpoints } from '../services/api';
import {
  Cog6ToothIcon,
  BuildingLibraryIcon,
  BellIcon,
  MoonIcon,
  ClockIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';

interface SystemSettings {
  siteName: string;
  emailNotifications: boolean;
  darkMode: boolean;
  sessionTimeoutMinutes: number;
}

export default function Settings() {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [settings, setSettings] = useState<SystemSettings>({
    siteName: 'LuckyPay Admin',
    emailNotifications: true,
    darkMode: false,
    sessionTimeoutMinutes: 30,
  });

  useEffect(() => {
    // Fetch settings on component mount
    const fetchSettings = async () => {
      setIsFetching(true);
      try {
        const { data } = await api.get(endpoints.settings.get);
        console.log('Fetched system settings:', data);
        setSettings(data);
      } catch (err) {
        console.error('Failed to fetch settings:', err);
        setError(
          'Failed to load system settings. Please try refreshing the page.',
        );
      } finally {
        setIsFetching(false);
      }
    };

    fetchSettings();
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setSettings((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      // Real API call to update settings
      await api.put(endpoints.settings.update, settings);
      console.log('Settings updated successfully:', settings);
      setSuccessMessage('Settings updated successfully');

      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err: any) {
      console.error('Failed to update settings:', err);
      setError(
        err.response?.data?.message ||
          'Failed to update settings. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <Cog6ToothIcon className="h-7 w-7 mr-2 text-primary" />
          System Settings
        </h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {successMessage && (
          <div className="mx-6 mt-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
            <CheckCircleIcon className="h-5 w-5 mr-2" />
            <span>{successMessage}</span>
          </div>
        )}

        {error && (
          <div className="mx-6 mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
            <ExclamationCircleIcon className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="flex items-center border-b border-gray-200 pb-4 mb-6">
              <BuildingLibraryIcon className="h-5 w-5 text-primary mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">
                General Settings
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <BuildingLibraryIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  name="siteName"
                  value={settings.siteName}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
                <label className="absolute -top-2.5 left-2 bg-white px-1 text-xs text-primary font-semibold">
                  Site Name
                </label>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ClockIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  type="number"
                  name="sessionTimeoutMinutes"
                  value={settings.sessionTimeoutMinutes}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  min="1"
                />
                <label className="absolute -top-2.5 left-2 bg-white px-1 text-xs text-primary font-semibold">
                  Session Timeout (minutes)
                </label>
              </div>
            </div>

            <div className="flex items-center border-b border-gray-200 pb-4 mb-6">
              <Cog6ToothIcon className="h-5 w-5 text-primary mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">
                Preferences
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center h-5">
                  <input
                    id="emailNotifications"
                    name="emailNotifications"
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={handleSwitchChange}
                    disabled={isLoading}
                    className="h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="emailNotifications"
                    className="flex items-center font-medium text-gray-700"
                  >
                    <BellIcon className="h-5 w-5 mr-2 text-primary" />
                    Email Notifications
                  </label>
                  <p className="text-gray-500 mt-1">
                    Receive email notifications for important system events
                  </p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center h-5">
                  <input
                    id="darkMode"
                    name="darkMode"
                    type="checkbox"
                    checked={settings.darkMode}
                    onChange={handleSwitchChange}
                    disabled={isLoading}
                    className="h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="darkMode"
                    className="flex items-center font-medium text-gray-700"
                  >
                    <MoonIcon className="h-5 w-5 mr-2 text-primary" />
                    Dark Mode
                  </label>
                  <p className="text-gray-500 mt-1">
                    Enable dark mode for the admin dashboard interface
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 text-right">
            <button
              type="submit"
              className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg transition-colors duration-300 flex items-center ml-auto font-medium"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <ArrowPathIcon className="animate-spin h-5 w-5 mr-2" />
                  Saving...
                </>
              ) : (
                'Save Settings'
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start">
        <InformationCircleIcon className="h-6 w-6 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-medium text-blue-800">About System Settings</h3>
          <p className="text-sm text-blue-700 mt-1">
            These settings control the global behavior of the LuckyPay admin
            panel. Some changes may require a page refresh to take effect.
            Session timeout changes will apply to new sessions only.
          </p>
        </div>
      </div>
    </div>
  );
}
