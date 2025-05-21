import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';

interface User {
  id: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

interface UpdateUserRoleDto {
  userId: string;
  role: string;
}

export function useUsers() {
  return useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      try {
        console.log('Fetching users - checking auth state:', {
          token: !!localStorage.getItem('admin_token'),
          user: localStorage.getItem('admin_user'),
        });

        const { data } = await api.get('/admin/users');
        console.log('Users data fetched successfully:', data);
        return data;
      } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
    },
    retry: false, // Don't retry on failure - let the api interceptor handle auth errors
    staleTime: 30000, // Cache for 30 seconds
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: UpdateUserRoleDto) => {
      try {
        console.log('Updating user role:', dto);
        const { data } = await api.put(`/admin/users/role`, dto);
        console.log('User role updated successfully:', data);
        return data;
      } catch (error) {
        console.error('Error updating user role:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
