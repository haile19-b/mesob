import { prisma } from "../../lib/prisma";

export const MealsService = {
  async create(user: any, data: any) {
    let targetVendorId = data.vendorId;

    if (!user.roles.includes('ADMIN')) {
      const vendor = await prisma.vendor.findUnique({
        where: { managerId: user.id }
      });
      if (!vendor) {
        throw new Error("You do not have an approved vendor profile to add meals to.");
      }
      targetVendorId = vendor.id;
    } else {
      if (!targetVendorId) {
        throw new Error("Admins must provide a vendorId.");
      }
    }

    return prisma.meal.create({
      data: {
        ...data,
        vendorId: targetVendorId
      }
    });
  },

  async update(user: any, mealId: string, data: any) {
    const meal = await prisma.meal.findUnique({ where: { id: mealId }, include: { vendor: true } });
    if (!meal) throw new Error("Meal not found");

    if (!user.roles.includes('ADMIN') && meal.vendor.managerId !== user.id) {
      throw new Error("You are not authorized to update this meal.");
    }

    return prisma.meal.update({
      where: { id: mealId },
      data
    });
  },

  async delete(user: any, mealId: string) {
    const meal = await prisma.meal.findUnique({ where: { id: mealId }, include: { vendor: true } });
    if (!meal) throw new Error("Meal not found");

    if (!user.roles.includes('ADMIN') && meal.vendor.managerId !== user.id) {
      throw new Error("You are not authorized to delete this meal.");
    }

    return prisma.meal.delete({
      where: { id: mealId }
    });
  },

  async getMealsByVendor(vendorId: string) {
    return prisma.meal.findMany({
      where: { vendorId }
    });
  }
};
