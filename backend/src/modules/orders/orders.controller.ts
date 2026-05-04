import type { Request, Response } from "express";
import { CreateOrderSchema, UpdateOrderStatusSchema } from "./orders.schema";
import { OrdersService } from "./orders.service";

export const OrdersController = {
  async create(req: Request, res: Response) {
    try {
      const data = CreateOrderSchema.parse(req.body);
      const user = (req as any).user;
      const order = await OrdersService.create(user, data);
      res.status(201).json(order);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  },

  async getMyOrders(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const orders = await OrdersService.getUserOrders(user.id);
      res.json(orders);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  },

  async getVendorOrders(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const orders = await OrdersService.getVendorOrders(user.id);
      res.json(orders);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  },

  async getAgentOrders(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const orders = await OrdersService.getAgentOrders(user.id);
      res.json(orders);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  },

  async updateStatus(req: Request, res: Response) {
    try {
      const data = UpdateOrderStatusSchema.parse(req.body);
      const user = (req as any).user;
      const order = await OrdersService.updateOrderStatus(user, req.params.id as string, data);
      res.json(order);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  },

  async acceptOrder(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const order = await OrdersService.acceptOrder(user.id, req.params.id as string);
      res.json(order);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  },

  async getVendorAgents(req: Request, res: Response) {
    try {
      const agents = await OrdersService.getVendorAgents(req.params.vendorId as string);
      res.json(agents);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  },
};
