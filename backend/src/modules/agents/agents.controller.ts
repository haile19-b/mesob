import type { Request, Response } from "express";
import { AgentApplySchema, VendorIdsSchema, AgentStatusSchema } from "./agents.schema";
import { AgentsService } from "./agents.service";

export const AgentsController = {
  async apply(req: Request, res: Response) {
    try {
      const data = AgentApplySchema.parse(req.body);
      const userId = (req as any).user.id;
      const agent = await AgentsService.apply(userId, data);
      res.json({ message: "Agent application submitted", agent });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  },

  async getProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const agent = await AgentsService.getAgentProfile(userId);
      res.json(agent);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  },

  async updateStatus(req: Request, res: Response) {
    try {
      const data = AgentStatusSchema.parse(req.body);
      const userId = (req as any).user.id;
      const agent = await AgentsService.updateStatus(userId, data.status);
      res.json({ message: "Status updated successfully", agent });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  },

  async getAvailableVendors(req: Request, res: Response) {
    try {
      const vendors = await AgentsService.getAvailableVendors();
      res.json(vendors);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  },

  async addVendors(req: Request, res: Response) {
    try {
      const data = VendorIdsSchema.parse(req.body);
      const userId = (req as any).user.id;
      const agent = await AgentsService.addVendors(userId, data.vendorIds);
      res.json({ message: "Vendors added to your service", agent });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  },

  async removeVendors(req: Request, res: Response) {
    try {
      const data = VendorIdsSchema.parse(req.body);
      const userId = (req as any).user.id;
      const agent = await AgentsService.removeVendors(userId, data.vendorIds);
      res.json({ message: "Vendors removed from your service", agent });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  }
};
