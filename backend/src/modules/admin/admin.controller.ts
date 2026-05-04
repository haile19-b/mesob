import type { Request, Response } from "express";
import { AdminService } from "./admin.service";

export const AdminController = {
  async approveVendor(req: Request, res: Response) {
    try {
      const vendor = await AdminService.approveVendor(req.params.id as string);
      res.json({ message: "Vendor approved", vendor });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  },

  async approveAgent(req: Request, res: Response) {
    try {
      const agent = await AdminService.approveAgent(req.params.id as string);
      res.json({ message: "Agent approved", agent });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  },

  async getAgents(req: Request, res: Response) {
    try {
      let isApproved: boolean | undefined = undefined;
      if (req.query.isApproved === 'true') isApproved = true;
      if (req.query.isApproved === 'false') isApproved = false;
      
      const agents = await AdminService.getAgents(isApproved);
      res.json(agents);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  }
};
