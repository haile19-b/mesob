import { apiClient } from '../api/client';
import type { Agent, Order, OrderItem, OrderType } from '../types/domain';

export const orderService = {
  getAvailableAgents: async (vendorId: string): Promise<Agent[]> => {
    const response = await apiClient.get<Agent[]>(`/orders/vendors/${vendorId}/agents`);
    return response.data;
  },

  placeOrder: async (orderPayload: {
    vendorId: string;
    orderType: OrderType;
    agentId?: string;
    items: Pick<OrderItem, 'mealId' | 'quantity'>[];
  }): Promise<Order> => {
    const response = await apiClient.post<Order>('/orders', orderPayload);
    return response.data;
  },

  getMyOrders: async (): Promise<Order[]> => {
    const response = await apiClient.get<Order[]>('/orders/my-orders');
    return response.data;
  },

  getAgentOrders: async (): Promise<Order[]> => {
    const response = await apiClient.get<Order[]>('/orders/agent');
    return response.data;
  },

  acceptOrder: async (orderId: string): Promise<Order> => {
    const response = await apiClient.post<Order>(`/orders/${orderId}/accept`);
    return response.data;
  },

  updateOrderStatus: async (orderId: string, status: Order['status']): Promise<Order> => {
    const response = await apiClient.patch<Order>(`/orders/${orderId}/status`, { status });
    return response.data;
  },
};
