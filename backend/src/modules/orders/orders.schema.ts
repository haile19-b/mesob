import { z } from "zod";
import { OrderType, OrderStatus } from "@prisma/client";

export const CreateOrderSchema = z.object({
  vendorId: z.string().uuid(),
  orderType: z.nativeEnum(OrderType),
  agentId: z.string().uuid().optional(),
  items: z.array(
    z.object({
      mealId: z.string().uuid(),
      quantity: z.number().int().positive().default(1),
    })
  ).min(1, "At least one item is required"),
}).refine((data) => {
  if (data.orderType === OrderType.DELIVERY) {
    return !!data.agentId;
  }
  return true;
}, {
  message: "agentId is required for DELIVERY orders",
  path: ["agentId"],
});

export const UpdateOrderStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus),
});
