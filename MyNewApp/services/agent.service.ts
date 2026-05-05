import { apiClient } from '../api/client';
import type { Agent, AgentStatus, Vendor } from '../types/domain';

export const agentService = {
  apply: async (payload: { accountNumber: string; workingHours: Array<{ start: string; end: string }> }) => {
    const response = await apiClient.post<{ message: string; agent: Agent }>('/agents/apply', payload);
    return response.data;
  },

  getMyProfile: async (): Promise<Agent> => {
    const response = await apiClient.get<Agent>('/agents/me');
    return response.data;
  },

  updateMyStatus: async (status: AgentStatus) => {
    const response = await apiClient.patch<{ message: string; agent: Agent }>('/agents/me/status', { status });
    return response.data;
  },

  getAvailableVendors: async (): Promise<Vendor[]> => {
    const response = await apiClient.get<Vendor[]>('/agents/available-vendors');
    return response.data;
  },

  addVendors: async (vendorIds: string[]) => {
    const response = await apiClient.post('/agents/vendors', { vendorIds });
    return response.data;
  },
};
