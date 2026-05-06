import { prisma } from "../../lib/prisma";

type CreateVendorInput = {
  name: string;
  location: string;
  phone?: string;
  imageFilename: string;
  managerId: string;
};

type UpdateVendorInput = {
  name?: string;
  location?: string;
  phone?: string;
};

export const VendorsService = {
  async create(data: CreateVendorInput) {
    return prisma.vendor.create({
      data
    });
  },

  async update(id: string, data: UpdateVendorInput) {
    return prisma.vendor.update({
      where: { id },
      data
    });
  },

  async list() {
    return prisma.vendor.findMany({
      where: { isApproved: true },
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

  async getMyVendor(managerId: string) {
    return prisma.vendor.findUnique({
      where: { managerId },
      include: {
        meals: true,
      },
    });
  },

  async getMyVendorAgents(managerId: string) {
    const vendor = await prisma.vendor.findUnique({
      where: { managerId },
      include: {
        agents: {
          include: {
            user: { select: { id: true, name: true, phone: true } },
          },
        },
      },
    });

    if (!vendor) {
      throw new Error("Vendor profile not found");
    }

    return vendor.agents;
  },

  async delete(id: string) {
    return prisma.vendor.delete({
      where: { id }
    });
  }
};
