import { z } from "zod";

const timeRegex = /^((1[0-2]|0?[1-9]):[0-5][0-9]\s?[aApP][mM]|([0-1]?[0-9]|2[0-3]):[0-5][0-9])$/;

export const AgentApplySchema = z.object({
  accountNumber: z.string().min(5),
  workingHours: z.array(
    z.object({
      start: z.string().regex(timeRegex, "Invalid time format (e.g., '08:00am' or '20:00')"),
      end: z.string().regex(timeRegex, "Invalid time format (e.g., '08:00am' or '20:00')"),
    })
  ).min(1, "At least one working time slot is required"),
});

export const VendorIdsSchema = z.object({
  vendorIds: z.array(z.string().uuid()).min(1, "At least one vendor ID is required"),
});

export const AgentStatusSchema = z.object({
  status: z.enum(["AVAILABLE", "BUSY", "OFFLINE"], {
    message: "Status must be one of: AVAILABLE, BUSY, OFFLINE"
  })
});
