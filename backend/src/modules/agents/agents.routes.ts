import { Router } from "express";
import { AgentsController } from "./agents.controller";
import { authMiddleware, requireRole } from "../../middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Agents
 *   description: Agent application and management endpoints
 */

/**
 * @swagger
 * /api/agents/apply:
 *   post:
 *     summary: Apply to become a delivery agent
 *     tags: [Agents]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - accountNumber
 *               - workingHours
 *             properties:
 *               accountNumber:
 *                 type: string
 *               workingHours:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - start
 *                     - end
 *                   properties:
 *                     start:
 *                       type: string
 *                       example: "08:00"
 *                     end:
 *                       type: string
 *                       example: "12:00"
 *     responses:
 *       200:
 *         description: Application submitted successfully
 */
router.post("/apply", authMiddleware, requireRole("USER", "AGENT", "VENDOR"), AgentsController.apply);

/**
 * @swagger
 * /api/agents/me:
 *   get:
 *     summary: Get the current agent's profile and status
 *     tags: [Agents]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Agent profile data
 */
router.get("/me", authMiddleware, requireRole("AGENT"), AgentsController.getProfile);

/**
 * @swagger
 * /api/agents/me/status:
 *   patch:
 *     summary: Update the agent's current working status
 *     tags: [Agents]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [AVAILABLE, BUSY, OFFLINE]
 *     responses:
 *       200:
 *         description: Status updated successfully
 */
router.patch("/me/status", authMiddleware, requireRole("AGENT"), AgentsController.updateStatus);

/**
 * @swagger
 * /api/agents/available-vendors:
 *   get:
 *     summary: Get a list of all approved vendors that an agent can deliver for
 *     tags: [Agents]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of vendors
 */
router.get("/available-vendors", authMiddleware, AgentsController.getAvailableVendors);

/**
 * @swagger
 * /api/agents/vendors:
 *   post:
 *     summary: Add multiple vendors to the agent's service (Agent must be approved)
 *     tags: [Agents]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - vendorIds
 *             properties:
 *               vendorIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Vendors added
 */
router.post("/vendors", authMiddleware, requireRole("AGENT"), AgentsController.addVendors);

/**
 * @swagger
 * /api/agents/vendors:
 *   delete:
 *     summary: Remove multiple vendors from the agent's service
 *     tags: [Agents]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - vendorIds
 *             properties:
 *               vendorIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Vendors removed
 */
router.delete("/vendors", authMiddleware, requireRole("AGENT"), AgentsController.removeVendors);

export default router;
