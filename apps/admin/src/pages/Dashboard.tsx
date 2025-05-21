import { useDashboardStats } from '../hooks/queries/useDashboardStats';
import {
  UsersIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';

export default function Dashboard() {
  const { data: stats, isLoading, error } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <p className="text-error font-medium">Error loading dashboard data</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 h-full flex items-center transform transition-all duration-300 hover:scale-105 hover:shadow-lg border-l-4 border-blue-500">
          <div className="p-3 rounded-full bg-blue-100 mr-4">
            <UsersIcon className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h2 className="text-gray-600 text-sm font-medium mb-1">
              Total Users
            </h2>
            <p className="text-2xl font-bold">
              {stats?.totalUsers.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 h-full flex items-center transform transition-all duration-300 hover:scale-105 hover:shadow-lg border-l-4 border-green-500">
          <div className="p-3 rounded-full bg-green-100 mr-4">
            <UserGroupIcon className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <h2 className="text-gray-600 text-sm font-medium mb-1">
              Active Users
            </h2>
            <p className="text-2xl font-bold">
              {stats?.activeUsers.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 h-full flex items-center transform transition-all duration-300 hover:scale-105 hover:shadow-lg border-l-4 border-purple-500">
          <div className="p-3 rounded-full bg-purple-100 mr-4">
            <ArrowTrendingUpIcon className="h-8 w-8 text-purple-600" />
          </div>
          <div>
            <h2 className="text-gray-600 text-sm font-medium mb-1">
              Total Transactions
            </h2>
            <p className="text-2xl font-bold">
              {stats?.totalTransactions.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 h-full flex items-center transform transition-all duration-300 hover:scale-105 hover:shadow-lg border-l-4 border-amber-500">
          <div className="p-3 rounded-full bg-amber-100 mr-4">
            <CurrencyDollarIcon className="h-8 w-8 text-amber-600" />
          </div>
          <div>
            <h2 className="text-gray-600 text-sm font-medium mb-1">Revenue</h2>
            <p className="text-2xl font-bold">
              ₱{stats?.revenue.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
