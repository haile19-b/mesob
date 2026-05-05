import { apiClient } from '../api/client';
import type { Meal, Vendor } from '../types/domain';

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
};
