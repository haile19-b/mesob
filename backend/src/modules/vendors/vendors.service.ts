import { prisma } from "../../lib/prisma";

export const VendorsService = {
  async create(data: any) {
    return prisma.vendor.create({
      data
    });
  },

  async update(id: string, data: any) {
    return prisma.vendor.update({
      where: { id },
      data
    });
  },

  async list() {
    return prisma.vendor.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        manager: {
          select: {
            id: true,
            name: true,
            phone: true
          }
        }
      }
    });
  },

  async get(id: string) {
    return prisma.vendor.findUnique({
      where: { id },
      include: {
        manager: {
          select: {
            id: true,
            name: true,
            phone: true
          }
        },
        meals: true,
        orders: true
      }
    });
  },

  async delete(id: string) {
    return prisma.vendor.delete({
      where: { id }
    });
  }
};
