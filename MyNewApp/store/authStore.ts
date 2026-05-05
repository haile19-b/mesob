import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { apiClient } from '../api/client';
import type { Role, User } from '../types/domain';

const TOKEN_KEY = 'userToken';
const USER_KEY = 'userData';

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
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
    set({ token, user, isLoading: false });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);
    set({ token: null, user: null, isLoading: false });
  },

  checkAuth: async () => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (token) {
        const rawUser = await SecureStore.getItemAsync(USER_KEY);
        const parsedUser: User | null = rawUser ? JSON.parse(rawUser) : null;
        set({ token, user: parsedUser, isLoading: false });
      } else {
        await SecureStore.deleteItemAsync(USER_KEY);
        set({ token: null, user: null, isLoading: false });
      }
    } catch {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_KEY);
      set({ token: null, user: null, isLoading: false });
    }
  },

  refreshUser: async () => {
    try {
      const state = useAuthStore.getState();
      if (!state.user) {
        set({ isLoading: false });
        return;
      }

      const roleSet = new Set<Role>(state.user.roles ?? []);

      try {
        // If this endpoint is reachable, backend confirms this user has AGENT role.
        await apiClient.get('/agents/me');
        roleSet.add('AGENT');
      } catch {
        // Intentionally ignore; user may not be an agent.
      }

      try {
        // If this endpoint is reachable, backend confirms this user has VENDOR role.
        await apiClient.get('/vendors/mine');
        roleSet.add('VENDOR');
      } catch {
        // Intentionally ignore; user may not be a vendor.
      }

      const nextUser: User = { ...state.user, roles: Array.from(roleSet) };
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(nextUser));
      set({ user: nextUser });
    } catch (error) {
      console.error('Failed to refresh user', error);
    }
  },
}));
