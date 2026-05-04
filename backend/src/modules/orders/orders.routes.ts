import { Router } from "express";
import { OrdersController } from "./orders.controller";
import { authMiddleware, requireRole } from "../../middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management endpoints
 */

// Protect all order routes
router.use(authMiddleware);

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - vendorId
 *               - orderType
 *               - items
 *             properties:
 *               vendorId:
 *                 type: string
 *               orderType:
 *                 type: string
 *                 enum: [DELIVERY, DINE_IN]
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     mealId:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *     responses:
 *       201:
 *         description: Order created successfully
 */
router.post("/", requireRole("USER"), OrdersController.create);

/**
 * @swagger
 * /api/orders/my-orders:
 *   get:
 *     summary: Get all orders placed by the current user
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user orders
 */
router.get("/my-orders", requireRole("USER"), OrdersController.getMyOrders);

/**
 * @swagger
 * /api/orders/vendor:
 *   get:
 *     summary: Get all orders for the vendor managed by the current user
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of vendor orders
 */
router.get("/vendor", requireRole("VENDOR"), OrdersController.getVendorOrders);

/**
 * @swagger
 * /api/orders/agent:
 *   get:
 *     summary: Get all orders assigned to the current agent
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of agent orders
 */
router.get("/agent", requireRole("AGENT"), OrdersController.getAgentOrders);

/**
 * @swagger
 * /api/orders/{id}/accept:
 *   post:
 *     summary: Accept a delivery order (Agent only)
 *     tags: [Orders]
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
 *         description: Order accepted successfully
 */
router.post("/:id/accept", requireRole("AGENT"), OrdersController.acceptOrder);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   patch:
 *     summary: Update the status of an order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
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
 *                 enum: [PENDING, ACCEPTED_BY_AGENT, PREPARING, OUT_FOR_DELIVERY, COMPLETED, CANCELLED]
 *     responses:
 *       200:
 *         description: Order status updated successfully
 */
router.patch("/:id/status", requireRole("VENDOR", "AGENT", "ADMIN", "USER"), OrdersController.updateStatus);

/**
 * @swagger
 * /api/orders/vendors/{vendorId}/agents:
 *   get:
 *     summary: Get a list of available agents for a specific vendor
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: vendorId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of agents
 */
router.get("/vendors/:vendorId/agents", requireRole("USER"), OrdersController.getVendorAgents);

export default router;
