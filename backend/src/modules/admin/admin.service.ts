import { prisma } from "../../lib/prisma";

export const AdminService = {
  async approveVendor(vendorId: string) {
    const vendor = await prisma.vendor.update({
      where: { id: vendorId },
      data: { isApproved: true }
    });

    const manager = await prisma.user.findUnique({ where: { id: vendor.managerId } });
    if (manager && !manager.roles.includes('VENDOR')) {
      await prisma.user.update({
        where: { id: manager.id },
        data: { roles: [...manager.roles, 'VENDOR'] }
      });
    }

    return vendor;
  },

  async approveAgent(agentId: string) {
    const agent = await prisma.agent.findUnique({ where: { id: agentId } });
    if (!agent) throw new Error("Agent application not found");

    const updatedAgent = await prisma.agent.update({
      where: { id: agentId },
      data: { isApproved: true }
    });

    // Add AGENT role to user
    const user = await prisma.user.findUnique({ where: { id: agent.userId } });
    if (user && !user.roles.includes('AGENT')) {
      await prisma.user.update({
        where: { id: agent.userId },
        data: { roles: { push: 'AGENT' } }
      });
    }

    return updatedAgent;
  },

  async getAgents(isApproved?: boolean) {
    return prisma.agent.findMany({
      where: isApproved !== undefined ? { isApproved } : undefined,
      include: { user: { select: { name: true, phone: true } } }
    });
  },

  async getVendors(isApproved?: boolean) {
    return prisma.vendor.findMany({
      where: isApproved !== undefined ? { isApproved } : undefined,
      include: { manager: { select: { name: true, phone: true } } },
      orderBy: { createdAt: "desc" },
    });
  },

  async declineVendor(vendorId: string) {
    const vendor = await prisma.vendor.findUnique({ where: { id: vendorId } });
    if (!vendor) throw new Error("Vendor application not found");
    if (vendor.isApproved) {
      throw new Error("Cannot decline an approved vendor from applications flow");
    }
    return prisma.vendor.delete({ where: { id: vendorId } });
  },

  async declineAgent(agentId: string) {
    const agent = await prisma.agent.findUnique({ where: { id: agentId } });
    if (!agent) throw new Error("Agent application not found");
    if (agent.isApproved) {
      throw new Error("Cannot decline an approved agent from applications flow");
    }
    return prisma.agent.delete({ where: { id: agentId } });
  },

  async getDashboardStats() {
    const [users, vendors, pendingVendors, agents, pendingAgents, orders, meals] = await Promise.all([
      prisma.user.count(),
      prisma.vendor.count({ where: { isApproved: true } }),
      prisma.vendor.count({ where: { isApproved: false } }),
      prisma.agent.count({ where: { isApproved: true } }),
      prisma.agent.count({ where: { isApproved: false } }),
      prisma.order.count(),
      prisma.meal.count(),
    ]);

    return {
      users,
      vendors,
      pendingVendors,
      agents,
      pendingAgents,
      orders,
      meals,
    };
  },
};
