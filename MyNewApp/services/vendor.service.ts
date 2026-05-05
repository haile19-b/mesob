import { apiClient } from '../api/client';
import type { Agent, Meal, Vendor } from '../types/domain';

export const vendorService = {
  getAllVendors: async (): Promise<Vendor[]> => {
    const response = await apiClient.get<Vendor[]>('/vendors');
    return response.data;
  },

  getVendorDetails: async (vendorId: string): Promise<Vendor> => {
    const response = await apiClient.get<Vendor>(`/vendors/${vendorId}`);
    return response.data;
  },

  getVendorMeals: async (vendorId: string): Promise<Meal[]> => {
    const response = await apiClient.get<Meal[]>(`/meals/vendor/${vendorId}`);
    return response.data;
  },

  applyAsVendor: async (payload: { name: string; location: string; phone?: string }) => {
    const response = await apiClient.post<Vendor>('/vendors', payload);
    return response.data;
  },

  getMyVendor: async (): Promise<Vendor & { meals?: Meal[] }> => {
    const response = await apiClient.get<Vendor & { meals?: Meal[] }>('/vendors/mine');
    return response.data;
  },

  getMyVendorAgents: async (): Promise<Agent[]> => {
    const response = await apiClient.get<Agent[]>('/vendors/mine/agents');
    return response.data;
  },
};
