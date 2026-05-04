import { prisma } from "../../lib/prisma";
import { OrderType, OrderStatus, Role } from "../../generated/prisma/client";
import { CreateOrderSchema, UpdateOrderStatusSchema } from "./orders.schema";
import { z } from "zod";

export const OrdersService = {
  async create(user: any, data: z.infer<typeof CreateOrderSchema>) {
    // Check if vendor exists
    const vendor = await prisma.vendor.findUnique({
      where: { id: data.vendorId },
    });
    if (!vendor) {
      throw new Error("Vendor not found");
    }

    // Check if agent exists for DELIVERY
    if (data.orderType === OrderType.DELIVERY && data.agentId) {
      const agent = await prisma.agent.findUnique({
        where: { id: data.agentId },
        include: { vendors: true }
      });
      if (!agent || !agent.isApproved) {
        throw new Error("Invalid or unapproved agent selected");
      }
      const servesVendor = agent.vendors.some(v => v.id === data.vendorId);
      if (!servesVendor) {
        throw new Error("The selected agent does not serve this vendor");
      }
    }

    // Fetch meals to get prices
    const mealIds = data.items.map((item) => item.mealId);
    const meals = await prisma.meal.findMany({
      where: {
        id: { in: mealIds },
        vendorId: data.vendorId, // ensure meals belong to the vendor
      },
    });

    if (meals.length !== mealIds.length) {
      throw new Error("One or more meals are invalid or do not belong to the vendor");
    }

    const mealPriceMap = new Map(meals.map((meal) => [meal.id, meal.price]));

    // Create the order
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        vendorId: data.vendorId,
        orderType: data.orderType,
        agentId: data.agentId,
        orderItems: {
          create: data.items.map((item) => ({
            mealId: item.mealId,
            quantity: item.quantity,
            price: mealPriceMap.get(item.mealId) || 0,
          })),
        },
      },
      include: {
        orderItems: true,
      },
    });

    return order;
  },

  async getUserOrders(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      include: {
        vendor: true,
        orderItems: { include: { meal: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async getVendorOrders(userId: string) {
    // First, find the vendor managed by this user
    const vendor = await prisma.vendor.findUnique({
      where: { managerId: userId },
    });

    if (!vendor) {
      throw new Error("You do not manage any vendor");
    }

    return prisma.order.findMany({
      where: { vendorId: vendor.id },
      include: {
        user: true,
        orderItems: { include: { meal: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async getAgentOrders(agentId: string) {
    return prisma.order.findMany({
      where: { agentId },
      include: {
        vendor: true,
        user: true,
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async updateOrderStatus(user: any, orderId: string, data: z.infer<typeof UpdateOrderStatusSchema>) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { vendor: true },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    // Role-based authorization and state transition logic
    const isVendorManager = order.vendor.managerId === user.id;
    const isAssignedAgent = order.agentId === user.id;
    const isOrderOwner = order.userId === user.id;
    const isAdmin = user.roles.includes(Role.ADMIN);

    if (!isVendorManager && !isAssignedAgent && !isOrderOwner && !isAdmin) {
      throw new Error("Not authorized to update this order");
    }

    // Specific user transitions (User completes the order)
    if (isOrderOwner && !isAdmin) {
      if (data.status !== OrderStatus.COMPLETED) {
        throw new Error("User can only mark orders as COMPLETED");
      }
      if (order.orderType === OrderType.DELIVERY && order.status !== OrderStatus.OUT_FOR_DELIVERY) {
        throw new Error("Delivery order must be OUT_FOR_DELIVERY to be marked as COMPLETED");
      }
      if (order.orderType === OrderType.DINE_IN && order.status !== OrderStatus.PREPARING) {
         throw new Error("Dine-in order must be PREPARING to be marked as COMPLETED");
      }
    }

    // Specific vendor transitions
    if (isVendorManager && !isAdmin) {
      if (data.status === OrderStatus.CANCELLED && order.status !== OrderStatus.PENDING) {
        throw new Error("Vendor can only cancel PENDING orders");
      }
      if (data.status === OrderStatus.PREPARING && order.status !== OrderStatus.PENDING && order.status !== OrderStatus.ACCEPTED_BY_AGENT) {
         throw new Error("Order must be PENDING or ACCEPTED_BY_AGENT to start preparing");
      }
    }

    // Specific agent transitions
    if (isAssignedAgent && !isAdmin) {
      if (data.status === OrderStatus.OUT_FOR_DELIVERY && order.status !== OrderStatus.PREPARING) {
        throw new Error("Order must be PREPARING to mark as OUT_FOR_DELIVERY");
      }
      if (data.status === OrderStatus.COMPLETED) {
        throw new Error("Only the user can mark the order as COMPLETED");
      }
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: data.status },
    });

    return updatedOrder;
  },

  async acceptOrder(agentId: string, orderId: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    if (order.orderType !== OrderType.DELIVERY) {
      throw new Error("Only DELIVERY orders can be accepted by an agent");
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new Error("Order is not available for delivery or already accepted");
    }

    if (order.agentId !== agentId) {
      throw new Error("You are not the assigned agent for this order");
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.PREPARING,
        acceptedAt: new Date(),
      },
    });

    return updatedOrder;
  },

  async getVendorAgents(vendorId: string) {
    return prisma.agent.findMany({
      where: {
        vendors: {
          some: { id: vendorId }
        },
        isApproved: true
      },
      include: { user: { select: { name: true, phone: true } } }
    });
  },
};
