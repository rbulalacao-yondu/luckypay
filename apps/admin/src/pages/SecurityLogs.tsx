import { useState } from 'react';
import { useSecurityLogs } from '../hooks/queries/useSecurityLogs';
import {
  ExclamationCircleIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  CalendarIcon,
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
  UserIcon,
  ComputerDesktopIcon,
} from '@heroicons/react/24/outline';
import {
  CheckCircleIcon,
  XCircleIcon,
  LockClosedIcon,
} from '@heroicons/react/24/solid';

const actionTypes = [
  'LOGIN',
  'LOGOUT',
  'PASSWORD_CHANGE',
  'ROLE_UPDATE',
  'FAILED_LOGIN',
  'OTP_VERIFICATION',
];

export default function SecurityLogs() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    startDate: null as Date | null,
    endDate: null as Date | null,
    action: '',
    userId: '',
  });

  const {
    data: logs,
    isLoading,
    error,
  } = useSecurityLogs({
    startDate: filters.startDate?.toISOString(),
    endDate: filters.endDate?.toISOString(),
    action: filters.action,
    userId: filters.userId,
    page,
    limit: rowsPerPage,
  });

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'LOGIN':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'LOGOUT':
        return <ArrowPathIcon className="h-5 w-5 text-blue-500" />;
      case 'FAILED_LOGIN':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'PASSWORD_CHANGE':
        return <LockClosedIcon className="h-5 w-5 text-yellow-500" />;
      case 'ROLE_UPDATE':
        return <UserIcon className="h-5 w-5 text-purple-500" />;
      case 'OTP_VERIFICATION':
        return <ShieldCheckIcon className="h-5 w-5 text-teal-500" />;
      default:
        return <ExclamationCircleIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'LOGIN':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'LOGOUT':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'FAILED_LOGIN':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'PASSWORD_CHANGE':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'ROLE_UPDATE':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'OTP_VERIFICATION':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

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
          <span>
            Error loading security logs:{' '}
            {error instanceof Error ? error.message : 'Unknown error'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <ShieldCheckIcon className="h-7 w-7 mr-2 text-primary" />
          Security Logs
        </h1>
        <p className="text-sm text-gray-500">
          {new Date().toLocaleDateString()}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-5 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CalendarIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              onChange={(e) => {
                const date = e.target.value ? new Date(e.target.value) : null;
                setFilters((prev) => ({ ...prev, startDate: date }));
              }}
            />
            <label className="absolute -top-2.5 left-2 bg-white px-1 text-xs text-primary font-semibold">
              Start Date
            </label>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CalendarIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              onChange={(e) => {
                const date = e.target.value ? new Date(e.target.value) : null;
                setFilters((prev) => ({ ...prev, endDate: date }));
              }}
            />
            <label className="absolute -top-2.5 left-2 bg-white px-1 text-xs text-primary font-semibold">
              End Date
            </label>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <ShieldCheckIcon className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
              value={filters.action}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, action: e.target.value }))
              }
            >
              <option value="">All Actions</option>
              {actionTypes.map((action) => (
                <option key={action} value={action}>
                  {action.replace('_', ' ')}
                </option>
              ))}
            </select>
            <label className="absolute -top-2.5 left-2 bg-white px-1 text-xs text-primary font-semibold">
              Action
            </label>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <UserIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={filters.userId}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, userId: e.target.value }))
              }
              placeholder="Search by User ID"
            />
            <label className="absolute -top-2.5 left-2 bg-white px-1 text-xs text-primary font-semibold">
              User ID
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Timestamp
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  User ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Action
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  IP Address
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logs?.data?.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {log.userId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getActionColor(log.action)}`}
                    >
                      <span className="mr-1">{getActionIcon(log.action)}</span>
                      {log.action.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono flex items-center">
                    <ComputerDesktopIcon className="h-4 w-4 mr-1 text-gray-400" />
                    {log.ipAddress}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => handleChangePage(page - 1)}
              disabled={page === 0}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                page === 0
                  ? 'text-gray-300 bg-gray-50'
                  : 'text-gray-700 bg-white hover:bg-gray-50'
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => handleChangePage(page + 1)}
              disabled={(page + 1) * rowsPerPage >= (logs?.total || 0)}
              className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                (page + 1) * rowsPerPage >= (logs?.total || 0)
                  ? 'text-gray-300 bg-gray-50'
                  : 'text-gray-700 bg-white hover:bg-gray-50'
              }`}
            >
              Next
            </button>
          </div>

          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{' '}
                <span className="font-medium">{page * rowsPerPage + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min((page + 1) * rowsPerPage, logs?.total || 0)}
                </span>{' '}
                of <span className="font-medium">{logs?.total || 0}</span>{' '}
                results
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                className="block w-full py-1 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                value={rowsPerPage}
                onChange={handleChangeRowsPerPage}
              >
                {[5, 10, 25].map((option) => (
                  <option key={option} value={option}>
                    {option} per page
                  </option>
                ))}
              </select>

              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  onClick={() => handleChangePage(page - 1)}
                  disabled={page === 0}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                    page === 0
                      ? 'text-gray-300'
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Previous</span>
                  <ArrowLongLeftIcon className="h-5 w-5" />
                </button>

                {Array.from({
                  length: Math.min(
                    5,
                    Math.ceil((logs?.total || 0) / rowsPerPage),
                  ),
                }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleChangePage(idx)}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                      page === idx
                        ? 'z-10 bg-primary text-white border-primary'
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}

                <button
                  onClick={() => handleChangePage(page + 1)}
                  disabled={(page + 1) * rowsPerPage >= (logs?.total || 0)}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                    (page + 1) * rowsPerPage >= (logs?.total || 0)
                      ? 'text-gray-300'
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Next</span>
                  <ArrowLongRightIcon className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
