import { prisma } from "../../lib/prisma";

export const AgentsService = {
  async apply(userId: string, data: any) {
    const existingAgent = await prisma.agent.findUnique({ where: { userId } });
    if (existingAgent) {
      throw new Error("You have already applied to be an agent");
    }

    return prisma.agent.create({
      data: {
        userId,
        accountNumber: data.accountNumber,
        workingHours: data.workingHours,
        isApproved: false,
      }
    });
  },

  async getAgentProfile(userId: string) {
    const agent = await prisma.agent.findUnique({
      where: { userId },
      include: { vendors: true }
    });
    if (!agent) {
      throw new Error("Agent profile not found");
    }
    return agent;
  },

  async updateStatus(userId: string, status: any) {
    const agent = await prisma.agent.findUnique({ where: { userId } });
    if (!agent) {
      throw new Error("Agent profile not found");
    }
    return prisma.agent.update({
      where: { id: agent.id },
      data: { status }
    });
  },

  async getAvailableVendors() {
    return prisma.vendor.findMany({
      where: { isApproved: true },
    });
  },

  async addVendors(userId: string, vendorIds: string[]) {
    const agent = await prisma.agent.findUnique({ where: { userId } });
    if (!agent || !agent.isApproved) {
      throw new Error("You must be an approved agent to add vendors");
    }

    return prisma.agent.update({
      where: { id: agent.id },
      data: {
        vendors: {
          connect: vendorIds.map(id => ({ id }))
        }
      },
      include: { vendors: true }
    });
  },

  async removeVendors(userId: string, vendorIds: string[]) {
    const agent = await prisma.agent.findUnique({ where: { userId } });
    if (!agent) {
      throw new Error("Agent not found");
    }

    return prisma.agent.update({
      where: { id: agent.id },
      data: {
        vendors: {
          disconnect: vendorIds.map(id => ({ id }))
        }
      },
      include: { vendors: true }
    });
  }
};
