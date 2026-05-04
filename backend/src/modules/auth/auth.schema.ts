import { z } from "zod";

export const RegisterSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(10),
  password: z.string().min(6),
});

export const LoginSchema = z.object({
  phone: z.string().min(10),
  password: z.string().min(6),
});
