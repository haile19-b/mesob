import cron from "node-cron";
import { prisma } from "../../lib/prisma";
import { OrderStatus } from "@prisma/client";

export function initOrderCron() {
  // Run every minute
  cron.schedule("* * * * *", async () => {
    try {
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

      // Find all PENDING orders older than 10 minutes
      const expiredOrders = await prisma.order.findMany({
        where: {
          status: OrderStatus.PENDING,
          createdAt: {
            lt: tenMinutesAgo,
          },
        },
      });

      if (expiredOrders.length > 0) {
        const orderIds = expiredOrders.map((o) => o.id);
        
        await prisma.order.updateMany({
          where: {
            id: { in: orderIds },
          },
          data: {
            status: OrderStatus.CANCELLED,
          },
        });

        console.log(`[Cron] Cancelled ${expiredOrders.length} expired orders.`);
      }
    } catch (error) {
      console.error("[Cron] Error cancelling expired orders:", error);
    }
  });
}
