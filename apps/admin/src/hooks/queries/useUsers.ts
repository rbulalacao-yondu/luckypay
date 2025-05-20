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
      const { data } = await api.get('/admin/users');
      return data;
    },
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: UpdateUserRoleDto) => {
      const { data } = await api.patch(`/admin/users/${dto.userId}/role`, {
        role: dto.role,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
