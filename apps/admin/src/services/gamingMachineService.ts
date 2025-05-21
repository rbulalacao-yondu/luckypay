import api from './api';
import type { GamingMachine } from '../types/GamingMachine';

const endpoints = {
  list: '/admin/gaming-machines',
  search: (query: string) => `/admin/gaming-machines/search?q=${query}`,
  getById: (id: string) => `/admin/gaming-machines/${id}`,
};

export const gamingMachineService = {
  async getGamingMachines(searchQuery?: string): Promise<GamingMachine[]> {
    try {
      const { data } = await api.get(
        searchQuery ? endpoints.search(searchQuery) : endpoints.list,
      );
      return data;
    } catch (error) {
      console.error('Failed to fetch gaming machines:', error);
      throw error;
    }
  },

  async getGamingMachine(id: string): Promise<GamingMachine> {
    try {
      const { data } = await api.get(endpoints.getById(id));
      return data;
    } catch (error) {
      console.error(`Failed to fetch gaming machine ${id}:`, error);
      throw error;
    }
  },
};
