import { apiClient } from '../api/client';
import type { AdminDashboardStats, Agent, Vendor } from '../types/domain';

export const adminService = {
  getDashboardStats: async (): Promise<AdminDashboardStats> => {
    const response = await apiClient.get<AdminDashboardStats>('/admin/dashboard');
    return response.data;
  },

  getVendorApplications: async (): Promise<Vendor[]> => {
    const response = await apiClient.get<Vendor[]>('/admin/vendors?isApproved=false');
    return response.data;
  },

  getAgentApplications: async (): Promise<Agent[]> => {
    const response = await apiClient.get<Agent[]>('/admin/agents?isApproved=false');
    return response.data;
  },

  approveVendor: async (vendorId: string) => {
    const response = await apiClient.put(`/admin/vendors/${vendorId}/approve`);
    return response.data;
  },

  declineVendor: async (vendorId: string) => {
    const response = await apiClient.put(`/admin/vendors/${vendorId}/decline`);
    return response.data;
  },

  approveAgent: async (agentId: string) => {
    const response = await apiClient.put(`/admin/agents/${agentId}/approve`);
    return response.data;
  },

  declineAgent: async (agentId: string) => {
    const response = await apiClient.put(`/admin/agents/${agentId}/decline`);
    return response.data;
  },
};
