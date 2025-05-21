import { useState } from 'react';
import {
  useOtpConfig,
  useUpdateOtpConfig,
} from '../hooks/queries/useOtpConfig';
import {
  KeyIcon,
  ClockIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  ShieldExclamationIcon,
  ArrowPathIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';

export default function OtpManagement() {
  const { data: config, isLoading, error } = useOtpConfig();
  const updateConfig = useUpdateOtpConfig();
  const [formData, setFormData] = useState({
    expiryMinutes: '',
    maxAttempts: '',
    cooldownMinutes: '',
  });
  const [successMessage, setSuccessMessage] = useState('');

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
          <ExclamationCircleIcon className="h-5 w-5 mr-2" />
          <span>Error loading OTP configuration</span>
        </div>
      </div>
    );
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const updatedConfig = {
      expiryMinutes: parseInt(
        formData.expiryMinutes || config?.expiryMinutes.toString() || '0',
      ),
      maxAttempts: parseInt(
        formData.maxAttempts || config?.maxAttempts.toString() || '0',
      ),
      cooldownMinutes: parseInt(
        formData.cooldownMinutes || config?.cooldownMinutes.toString() || '0',
      ),
    };

    updateConfig.mutate(updatedConfig, {
      onSuccess: () => {
        setSuccessMessage('OTP configuration updated successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      },
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <KeyIcon className="h-7 w-7 mr-2 text-primary" />
          OTP Management
        </h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500 flex items-start">
          <div className="p-3 rounded-full bg-blue-100 mr-4">
            <ClockIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-medium text-gray-800">
              OTP Expiry Time
            </h2>
            <p className="text-gray-600 mt-1">
              Current setting:{' '}
              <span className="font-medium">
                {config?.expiryMinutes} minutes
              </span>
            </p>
            <p className="text-xs text-gray-500 mt-2">
              The time until an OTP expires after being generated.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-amber-500 flex items-start">
          <div className="p-3 rounded-full bg-amber-100 mr-4">
            <ShieldExclamationIcon className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <h2 className="text-lg font-medium text-gray-800">Max Attempts</h2>
            <p className="text-gray-600 mt-1">
              Current setting:{' '}
              <span className="font-medium">
                {config?.maxAttempts} attempts
              </span>
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Maximum number of incorrect OTP attempts before lockout.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500 flex items-start">
          <div className="p-3 rounded-full bg-purple-100 mr-4">
            <ClockIcon className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-lg font-medium text-gray-800">
              Cooldown Period
            </h2>
            <p className="text-gray-600 mt-1">
              Current setting:{' '}
              <span className="font-medium">
                {config?.cooldownMinutes} minutes
              </span>
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Duration of lockout after maximum attempts are reached.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <InformationCircleIcon className="h-5 w-5 mr-2 text-primary" />
            Configure OTP Settings
          </h2>
        </div>

        {successMessage && (
          <div className="mx-6 mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
            <CheckCircleIcon className="h-5 w-5 mr-2" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <ClockIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                type="number"
                name="expiryMinutes"
                min="1"
                value={formData.expiryMinutes || config?.expiryMinutes || ''}
                onChange={handleInputChange}
                placeholder={config?.expiryMinutes.toString()}
                disabled={updateConfig.isPending}
              />
              <label className="absolute -top-2.5 left-2 bg-white px-1 text-xs text-primary font-semibold">
                OTP Expiry (minutes)
              </label>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <ShieldExclamationIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                type="number"
                name="maxAttempts"
                min="1"
                value={formData.maxAttempts || config?.maxAttempts || ''}
                onChange={handleInputChange}
                placeholder={config?.maxAttempts.toString()}
                disabled={updateConfig.isPending}
              />
              <label className="absolute -top-2.5 left-2 bg-white px-1 text-xs text-primary font-semibold">
                Maximum Attempts
              </label>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <ClockIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                type="number"
                name="cooldownMinutes"
                min="1"
                value={
                  formData.cooldownMinutes || config?.cooldownMinutes || ''
                }
                onChange={handleInputChange}
                placeholder={config?.cooldownMinutes.toString()}
                disabled={updateConfig.isPending}
              />
              <label className="absolute -top-2.5 left-2 bg-white px-1 text-xs text-primary font-semibold">
                Cooldown Period (minutes)
              </label>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg transition-colors duration-300 flex items-center font-medium"
              disabled={updateConfig.isPending}
            >
              {updateConfig.isPending ? (
                <>
                  <ArrowPathIcon className="animate-spin h-5 w-5 mr-2" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start">
        <InformationCircleIcon className="h-6 w-6 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-medium text-blue-800">About OTP Configuration</h3>
          <p className="text-sm text-blue-700 mt-1">
            One-Time Password (OTP) settings control the security parameters for
            user authentication. Changes to these settings will take effect
            immediately for all new OTP requests.
          </p>
        </div>
      </div>
    </div>
  );
}
