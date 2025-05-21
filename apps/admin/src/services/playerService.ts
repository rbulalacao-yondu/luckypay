import api from './api';
import type { User } from '../types/User';

const endpoints = {
  list: '/admin/players',
  search: (query: string) => `/admin/players/search?q=${query}`,
  getById: (id: number) => `/admin/players/${id}`,
};

export const playerService = {
  async getPlayers(searchQuery?: string): Promise<User[]> {
    try {
      const { data } = await api.get(
        searchQuery ? endpoints.search(searchQuery) : endpoints.list,
      );
      return data;
    } catch (error) {
      console.error('Failed to fetch players:', error);
      throw error;
    }
  },

  async getPlayer(id: number): Promise<User> {
    try {
      const { data } = await api.get(endpoints.getById(id));
      return data;
    } catch (error) {
      console.error(`Failed to fetch player ${id}:`, error);
      throw error;
    }
  },
};
