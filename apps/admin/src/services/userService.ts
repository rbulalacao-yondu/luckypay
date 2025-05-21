import api from './api';
import type { User } from '../types/User';

export interface CreateUserDto {
  email?: string;
  mobileNumber: string;
  firstName?: string;
  lastName?: string;
  role: string;
  status: string;
  password?: string;
}

export interface UpdateUserDto extends Partial<CreateUserDto> {
  id: number;
}

export const userService = {
  getUsers: async (search?: string) => {
    const response = await api.get('/admin/users', { params: { search } });
    return response.data as User[];
  },

  getUser: async (id: number) => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data as User;
  },

  createUser: async (data: CreateUserDto) => {
    const response = await api.post('/admin/users', data);
    return response.data as User;
  },

  updateUser: async (data: UpdateUserDto) => {
    const response = await api.put(`/admin/users/${data.id}`, data);
    return response.data as User;
  },

  deleteUser: async (id: number) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },
};
