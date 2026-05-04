import { z } from "zod";

export const CreateMealSchema = z.object({
  name: z.string().min(2),
  imageUrl: z.string().url().optional(),
  price: z.number().positive(),
  isDeliveryAvailable: z.boolean().optional(),
  isFreeDelivery: z.boolean().optional(),
  vendorId: z.string().uuid().optional() // Admins provide this
});

export const UpdateMealSchema = z.object({
  name: z.string().optional(),
  imageUrl: z.string().url().optional(),
  price: z.number().positive().optional(),
  isDeliveryAvailable: z.boolean().optional(),
  isFreeDelivery: z.boolean().optional()
});
