import { apiClient } from '../api/client';
import type { Meal } from '../types/domain';

export const mealService = {
  createMeal: async (payload: {
    name: string;
    price: number;
    imageUrl?: string;
    isDeliveryAvailable?: boolean;
    isFreeDelivery?: boolean;
    vendorId?: string;
  }): Promise<Meal> => {
    const response = await apiClient.post<Meal>('/meals', payload);
    return response.data;
  },
};
