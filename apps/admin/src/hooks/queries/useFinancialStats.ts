import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';

export interface FinancialStats {
  totalTransactionsToday: number;
  avgTransactionValue: number;
  totalRevenueToday: number;
  revenueGrowth: number;
  dailyRevenue: {
    date: string;
    coinIns: number;
    cashIns: number;
    total: number;
  }[];
}

export const useFinancialStats = () => {
  return useQuery({
    queryKey: ['financialStats'],
    queryFn: async (): Promise<FinancialStats> => {
      const { data } = await api.get('/admin/dashboard/financial-stats');
      return data;
    },
  });
};
