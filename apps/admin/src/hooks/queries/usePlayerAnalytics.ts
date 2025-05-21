import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';

export interface PlayerAnalyticsData {
  loyaltyDistribution: {
    tier: string;
    count: number;
  }[];
  activePlayers: {
    date: string;
    count: number;
  }[];
  playerSegments: {
    type: 'new' | 'returning';
    count: number;
  }[];
  topPlayers: {
    id: number;
    name: string;
    volume: number;
    loyaltyTier: string;
  }[];
  betSizes: {
    range: string;
    count: number;
  }[];
  gamePreferences: {
    type: string;
    count: number;
  }[];
  timeOfDayActivity: {
    hour: number;
    players: number;
    volume: number;
  }[];
  loyaltyPointsData: {
    tier: string;
    averagePoints: number;
    totalPoints: number;
  }[];
}

export function usePlayerAnalytics(days: number = 7) {
  return useQuery<PlayerAnalyticsData>({
    queryKey: ['playerAnalytics', days],
    queryFn: async () => {
      const { data } = await api.get(
        `/admin/dashboard/player-analytics?days=${days}`,
      );
      return data;
    },
    // Refresh every 5 minutes
    refetchInterval: 5 * 60 * 1000,
  });
}
