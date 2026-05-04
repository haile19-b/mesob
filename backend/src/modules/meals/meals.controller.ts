import type { Request, Response } from "express";
import { CreateMealSchema, UpdateMealSchema } from "./meals.schema";
import { MealsService } from "./meals.service";

export const MealsController = {
  async create(req: Request, res: Response) {
    try {
      const data = CreateMealSchema.parse(req.body);
      const user = (req as any).user;
      const meal = await MealsService.create(user, data);
      res.status(201).json(meal);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const data = UpdateMealSchema.parse(req.body);
      const user = (req as any).user;
      const meal = await MealsService.update(user, req.params.id as string, data);
      res.json(meal);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      await MealsService.delete(user, req.params.id as string);
      res.json({ message: "Meal deleted successfully" });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  },

  async getMealsByVendor(req: Request, res: Response) {
    try {
      const meals = await MealsService.getMealsByVendor(req.params.vendorId as string);
      res.json(meals);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  }
};
