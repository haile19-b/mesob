import { apiClient } from '../api/client';
import type { AuthResponse } from '../types/domain';

export const authService = {
  login: async (phone: string, password: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', { phone, password });
    return response.data;
  },

  register: async (name: string, phone: string, password: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', { name, phone, password });
    return response.data;
  },
};
