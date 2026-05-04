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
  }
};
