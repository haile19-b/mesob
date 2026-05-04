import { Router } from "express";
import { MealsController } from "./meals.controller";
import { authMiddleware, requireRole } from "../../middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Meals
 *   description: Meal management endpoints
 */

/**
 * @swagger
 * /api/meals:
 *   post:
 *     summary: Create a new meal
 *     description: Admins must provide vendorId. Vendors will have the meal automatically assigned to their shop.
 *     tags: [Meals]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               imageUrl:
 *                 type: string
 *               isDeliveryAvailable:
 *                 type: boolean
 *               isFreeDelivery:
 *                 type: boolean
 *               vendorId:
 *                 type: string
 *                 description: Only required if the user is an ADMIN
 *     responses:
 *       201:
 *         description: Meal created successfully
 */
router.post("/", authMiddleware, requireRole("ADMIN", "VENDOR"), MealsController.create);

/**
 * @swagger
 * /api/meals/{id}:
 *   put:
 *     summary: Update an existing meal
 *     tags: [Meals]
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
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               imageUrl:
 *                 type: string
 *               isDeliveryAvailable:
 *                 type: boolean
 *               isFreeDelivery:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Meal updated successfully
 */
router.put("/:id", authMiddleware, requireRole("ADMIN", "VENDOR"), MealsController.update);

/**
 * @swagger
 * /api/meals/{id}:
 *   delete:
 *     summary: Delete a meal
 *     tags: [Meals]
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
 *         description: Meal deleted successfully
 */
router.delete("/:id", authMiddleware, requireRole("ADMIN", "VENDOR"), MealsController.delete);

/**
 * @swagger
 * /api/meals/vendor/{vendorId}:
 *   get:
 *     summary: Get all meals for a specific vendor
 *     tags: [Meals]
 *     parameters:
 *       - in: path
 *         name: vendorId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of meals
 */
router.get("/vendor/:vendorId", MealsController.getMealsByVendor);

export default router;
