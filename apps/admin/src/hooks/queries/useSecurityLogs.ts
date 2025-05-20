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

interface QuerySecurityLogsDto {
  startDate?: string;
  endDate?: string;
  userId?: string;
  action?: string;
  page?: number;
  limit?: number;
}

export function useSecurityLogs(query: QuerySecurityLogsDto = {}) {
  return useQuery<SecurityLog[]>({
    queryKey: ['securityLogs', query],
    queryFn: async () => {
      const { data } = await api.get('/admin/security-logs', { params: query });
      return data;
    },
  });
}
