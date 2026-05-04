import type { Request, Response } from "express";
import {
  CreateVendorSchema,
  UpdateVendorSchema
} from "./vendors.schema";
import { VendorsService } from "./vendors.service";

export const VendorsController = {
  async create(req: Request, res: Response) {
    const data = CreateVendorSchema.parse(req.body);
    const managerId = (req as any).user.id;
    res.json(await VendorsService.create({ ...data, managerId }));
  },

  async update(req: Request, res: Response) {
    const data = UpdateVendorSchema.parse(req.body);
    res.json(await VendorsService.update(req.params.id as string, data));
  },

  async list(req: Request, res: Response) {
    res.json(await VendorsService.list());
  },

  async get(req: Request, res: Response) {
    res.json(await VendorsService.get(req.params.id as string));
  },

  async delete(req: Request, res: Response) {
    res.json(await VendorsService.delete(req.params.id as string));
  }
};
