import api from './api';
import type { CashIn } from '../types/CashIn';

const endpoints = {
  list: '/admin/cash-ins',
  search: (query: string) => `/admin/cash-ins/search?q=${query}`,
  getById: (id: string) => `/admin/cash-ins/${id}`,
};

export const cashInService = {
  async getCashIns(searchQuery?: string): Promise<CashIn[]> {
    try {
      const { data } = await api.get(
        searchQuery ? endpoints.search(searchQuery) : endpoints.list,
      );
      return data;
    } catch (error) {
      console.error('Failed to fetch cash-ins:', error);
      throw error;
    }
  },

  async getCashIn(id: string): Promise<CashIn> {
    try {
      const { data } = await api.get(endpoints.getById(id));
      return data;
    } catch (error) {
      console.error(`Failed to fetch cash-in ${id}:`, error);
      throw error;
    }
  },
};
