import type { Request, Response } from "express";
import { RegisterSchema, LoginSchema } from "./auth.schema";
import { AuthService } from "./auth.service";

export const AuthController = {
  async register(req: Request, res: Response) {
    try {
      const data = RegisterSchema.parse(req.body);
      const user = await AuthService.register(data);
      res.status(201).json(user);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const data = LoginSchema.parse(req.body);
      const result = await AuthService.login(data);
      res.json(result);
    } catch (e: any) {
      res.status(401).json({ error: e.message });
    }
  }
};
