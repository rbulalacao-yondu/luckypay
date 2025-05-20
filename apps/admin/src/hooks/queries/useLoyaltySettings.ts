import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';

interface LoyaltySettings {
  pointsPerTransaction: number;
  minimumPoints: number;
  conversionRate: number;
}

interface UpdateLoyaltySettingsDto {
  pointsPerTransaction?: number;
  minimumPoints?: number;
  conversionRate?: number;
}

export function useLoyaltySettings() {
  return useQuery<LoyaltySettings>({
    queryKey: ['loyaltySettings'],
    queryFn: async () => {
      const { data } = await api.get('/admin/loyalty-settings');
      return data;
    },
  });
}

export function useUpdateLoyaltySettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: UpdateLoyaltySettingsDto) => {
      const { data } = await api.patch('/admin/loyalty-settings', settings);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loyaltySettings'] });
    },
  });
}
