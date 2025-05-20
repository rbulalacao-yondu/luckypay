import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';

interface OtpConfig {
  expiryMinutes: number;
  maxAttempts: number;
  cooldownMinutes: number;
}

export function useOtpConfig() {
  return useQuery<OtpConfig>({
    queryKey: ['otpConfig'],
    queryFn: async () => {
      const { data } = await api.get('/admin/otp-config');
      return data;
    },
  });
}

export function useUpdateOtpConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: Partial<OtpConfig>) => {
      const { data } = await api.patch('/admin/otp-config', config);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['otpConfig'] });
    },
  });
}
