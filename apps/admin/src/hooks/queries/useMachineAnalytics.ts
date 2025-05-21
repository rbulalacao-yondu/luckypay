import { useQuery } from '@tanstack/react-query';
import { machineAnalyticsService } from '../../services/machineAnalyticsService';
import type { MachineAnalytics } from '../../types/MachineAnalytics';

export function useMachineAnalytics(days: number = 7) {
  return useQuery<MachineAnalytics>({
    queryKey: ['machineAnalytics', days],
    queryFn: () => machineAnalyticsService.getMachineAnalytics(days),
    // Refresh every 5 minutes
    refetchInterval: 5 * 60 * 1000,
  });
}
