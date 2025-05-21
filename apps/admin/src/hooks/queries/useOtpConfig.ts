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
      console.log('Fetching OTP config - checking auth state:', {
        token: !!localStorage.getItem('admin_token'),
        user: localStorage.getItem('admin_user'),
      });

      const { data } = await api.get('/admin/otp/settings');
      console.log('OTP config fetched successfully:', data);
      return data;
    },
    retry: false,
    staleTime: 30000, // Cache for 30 seconds
  });
}

export function useUpdateOtpConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: Partial<OtpConfig>) => {
      const { data } = await api.put('/admin/otp/settings', config);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['otpConfig'] });
    },
  });
}
