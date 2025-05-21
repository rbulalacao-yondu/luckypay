import { api } from './api';
import type { MachineAnalytics } from '../types/MachineAnalytics';

const endpoints = {
  analytics: (days: number) => `/admin/machine-analytics?days=${days}`,
};

export const machineAnalyticsService = {
  async getMachineAnalytics(days: number = 7): Promise<MachineAnalytics> {
    try {
      const { data } = await api.get(endpoints.analytics(days));
      return data;
    } catch (error) {
      console.error('Failed to fetch machine analytics:', error);
      throw error;
    }
  },
};
