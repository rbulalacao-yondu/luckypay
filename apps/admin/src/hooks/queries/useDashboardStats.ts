import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalTransactions: number;
  revenue: number;
}

export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const { data } = await api.get('/admin/dashboard/stats');
      return data;
    },
    // Refresh every 5 minutes
    refetchInterval: 5 * 60 * 1000,
  });
}
