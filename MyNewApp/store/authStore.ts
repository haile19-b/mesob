import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { apiClient } from '../api/client';

export type Role = 'USER' | 'AGENT' | 'VENDOR' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  phone: string;
  roles: Role[];
  // any other fields you want to track
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  refreshUser: () => Promise<void>; // Fetch user again to get updated roles
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,

  login: async (token, user) => {
    await SecureStore.setItemAsync('userToken', token);
    set({ token, user, isLoading: false });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('userToken');
    set({ token: null, user: null, isLoading: false });
  },

  checkAuth: async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (token) {
        // Here we could verify the token or fetch user profile
        // For now, we will assume if we have a token, we are somewhat logged in.
        // We will immediately try to fetch the updated user profile
        set({ token, isLoading: true });
        
        try {
          // This endpoint should return the current logged-in user profile, e.g., /api/auth/me
          // We will use a mock placeholder or standard /me endpoint
          const res = await apiClient.get('/users/me'); // Assuming you have a route to get current user
          set({ user: res.data, isLoading: false });
        } catch (e) {
          // If token is invalid/expired
          await SecureStore.deleteItemAsync('userToken');
          set({ token: null, user: null, isLoading: false });
        }
      } else {
        set({ isLoading: false });
      }
    } catch (e) {
      set({ isLoading: false });
    }
  },

  refreshUser: async () => {
    try {
      // Allows refreshing roles without logging out
      const res = await apiClient.get('/users/me');
      set({ user: res.data });
    } catch (error) {
      console.error('Failed to refresh user', error);
    }
  }
}));
