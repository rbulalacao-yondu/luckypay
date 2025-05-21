import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';

interface SecurityLog {
  id: string;
  userId: string;
  action: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

interface SecurityLogsResponse {
  data: SecurityLog[];
  total: number;
}

interface QuerySecurityLogsDto {
  startDate?: string;
  endDate?: string;
  userId?: string;
  action?: string;
  page?: number;
  limit?: number;
}

export function useSecurityLogs(query: QuerySecurityLogsDto = {}) {
  return useQuery<SecurityLogsResponse>({
    queryKey: ['securityLogs', query],
    queryFn: async () => {
      try {
        console.log('Fetching security logs - checking auth state:', {
          token: !!localStorage.getItem('admin_token'),
          user: localStorage.getItem('admin_user'),
          query,
        });

        const response = await api.get<SecurityLogsResponse>(
          '/admin/security-logs',
          { params: query },
        );
        console.log('Security logs fetched successfully:', response.data);
        return response.data;
      } catch (error) {
        console.error('Error fetching security logs:', error);
        throw error;
      }
    },
    retry: false, // Don't retry on failure - let the api interceptor handle auth errors
    staleTime: 30000, // Cache for 30 seconds
  });
}
