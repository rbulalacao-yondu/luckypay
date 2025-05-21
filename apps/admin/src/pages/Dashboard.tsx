import { useDashboardStats } from '../hooks/queries/useDashboardStats';

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
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6 h-full flex flex-col justify-center">
          <h2 className="text-gray-600 text-sm font-medium mb-2">
            Total Users
          </h2>
          <p className="text-2xl font-bold">
            {stats?.totalUsers.toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 h-full flex flex-col justify-center">
          <h2 className="text-gray-600 text-sm font-medium mb-2">
            Active Users
          </h2>
          <p className="text-2xl font-bold">
            {stats?.activeUsers.toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 h-full flex flex-col justify-center">
          <h2 className="text-gray-600 text-sm font-medium mb-2">
            Total Transactions
          </h2>
          <p className="text-2xl font-bold">
            {stats?.totalTransactions.toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 h-full flex flex-col justify-center">
          <h2 className="text-gray-600 text-sm font-medium mb-2">Revenue</h2>
          <p className="text-2xl font-bold">
            ₱{stats?.revenue.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
