import { Router } from "express";
import { AdminController } from "./admin.controller";
import { authMiddleware, requireRole } from "../../middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Administrative endpoints
 */

/**
 * @swagger
 * /api/admin/vendors/{id}/approve:
 *   put:
 *     summary: Approve a vendor application and grant the VENDOR role
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Vendor approved successfully
 */
router.put("/vendors/:id/approve", authMiddleware, requireRole("ADMIN"), AdminController.approveVendor);

/**
 * @swagger
 * /api/admin/agents/{id}/approve:
 *   put:
 *     summary: Approve an agent application and grant the AGENT role
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Agent approved successfully
 */
router.put("/agents/:id/approve", authMiddleware, requireRole("ADMIN"), AdminController.approveAgent);

/**
 * @swagger
 * /api/admin/agents:
 *   get:
 *     summary: Get a list of agents (optionally filter by approval status)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: isApproved
 *         schema:
 *           type: boolean
 *         description: Filter agents by approval status
 *     responses:
 *       200:
 *         description: List of agents
 */
router.get("/agents", authMiddleware, requireRole("ADMIN"), AdminController.getAgents);

export default router;
