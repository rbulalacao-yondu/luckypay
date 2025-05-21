import api from './api';
import type { CoinIn } from '../types/CoinIn';

export const coinInService = {
  getAll: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    fromDate?: string;
    toDate?: string;
    machineId?: string;
    gameType?: string;
  }) => {
    const response = await api.get('/admin/coin-ins', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/admin/coin-ins/${id}`);
    return response.data as CoinIn;
  },
};
