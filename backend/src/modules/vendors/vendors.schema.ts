import { z } from "zod";

export const CreateVendorSchema = z.object({
  name: z.string().min(2),
  location: z.string(),
  phone: z.string().optional(),
}).strict();

export const UpdateVendorSchema = z.object({
  name: z.string().optional(),
  location: z.string().optional(),
  phone: z.string().optional(),
}).strict();
