import type { Request, Response } from "express";
import fs from "fs/promises";
import path from "path";
import {
  CreateVendorSchema,
  UpdateVendorSchema
} from "./vendors.schema";
import { VendorsService } from "./vendors.service";

const buildVendorImageUrl = (req: Request, filename?: string | null) => {
  if (!filename) return null;
  return `${req.protocol}://${req.get("host")}/uploads/${filename}`;
};

const formatVendorResponse = (req: Request, vendor: any) => {
  if (!vendor) return vendor;
  const { imageFilename, ...rest } = vendor;
  return {
    ...rest,
    imageUrl: buildVendorImageUrl(req, imageFilename ?? null),
  };
};

const removeUploadedFile = async (filename?: string) => {
  if (!filename) return;
  try {
    await fs.unlink(path.join(process.cwd(), "uploads", filename));
  } catch {
    return;
  }
};

export const VendorsController = {
  async create(req: Request, res: Response) {
    const data = CreateVendorSchema.parse(req.body);
    const managerId = (req as any).user.id;

    const file = (req as any).file as { filename?: string } | undefined;
    if (!file?.filename) {
      return res.status(400).json({ error: "Image file is required" });
    }

    const existingVendor = await VendorsService.getMyVendor(managerId);
    if (existingVendor) {
      await removeUploadedFile(file.filename);
      return res.status(409).json({
        error: existingVendor.isApproved
          ? "You already have a vendor profile."
          : "Your vendor application is already submitted and pending approval.",
      });
    }

    try {
      const vendor = await VendorsService.create({
        name: data.name,
        location: data.location,
        phone: data.phone,
        imageFilename: file.filename,
        managerId,
      });
      res.json(formatVendorResponse(req, vendor));
    } catch (error: any) {
      if (error?.code === "P2002") {
        await removeUploadedFile(file.filename);
        return res.status(409).json({ error: "You already have a vendor profile." });
      }
      throw error;
    }
  },

  async update(req: Request, res: Response) {
    const data = UpdateVendorSchema.parse(req.body);
    res.json(await VendorsService.update(req.params.id as string, data));
  },

  async list(req: Request, res: Response) {
    const vendors = await VendorsService.list();
    res.json(vendors.map((vendor) => formatVendorResponse(req, vendor)));
  },

  async get(req: Request, res: Response) {
    const vendor = await VendorsService.get(req.params.id as string);
    res.json(formatVendorResponse(req, vendor));
  },

  async getMine(req: Request, res: Response) {
    const managerId = (req as any).user.id as string;
    const vendor = await VendorsService.getMyVendor(managerId);
    if (!vendor) {
      return res.status(404).json({ error: "Vendor profile not found" });
    }
    res.json(formatVendorResponse(req, vendor));
  },

  async getMyAgents(req: Request, res: Response) {
    try {
      const managerId = (req as any).user.id as string;
      const agents = await VendorsService.getMyVendorAgents(managerId);
      res.json(agents);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  },

  async delete(req: Request, res: Response) {
    res.json(await VendorsService.delete(req.params.id as string));
  }
};
