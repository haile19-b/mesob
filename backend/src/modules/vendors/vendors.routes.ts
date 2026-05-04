import { Router } from "express";
import { VendorsController } from "./vendors.controller";
import { authMiddleware, requireRole } from "../../middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Vendors
 *   description: Vendor management endpoints
 */

/**
 * @swagger
 * /api/vendors:
 *   post:
 *     summary: Create a new vendor
 *     tags: [Vendors]
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
 *               - location
 *             properties:
 *               name:
 *                 type: string
 *               location:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Vendor created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post("/", authMiddleware, VendorsController.create);

/**
 * @swagger
 * /api/vendors:
 *   get:
 *     summary: List all vendors
 *     tags: [Vendors]
 *     responses:
 *       200:
 *         description: A list of vendors
 *       500:
 *         description: Internal server error
 */
router.get("/", VendorsController.list);

/**
 * @swagger
 * /api/vendors/{id}:
 *   get:
 *     summary: Get a vendor by ID
 *     tags: [Vendors]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The vendor ID
 *     responses:
 *       200:
 *         description: Vendor found
 *       404:
 *         description: Vendor not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", VendorsController.get);

/**
 * @swagger
 * /api/vendors/{id}:
 *   put:
 *     summary: Update a vendor by ID
 *     tags: [Vendors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The vendor ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               location:
 *                 type: string
 *               phone:
 *                 type: string
 *               managerId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Vendor updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.put("/:id", authMiddleware, requireRole("ADMIN", "VENDOR"), VendorsController.update);

/**
 * @swagger
 * /api/vendors/{id}:
 *   delete:
 *     summary: Delete a vendor by ID
 *     tags: [Vendors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The vendor ID
 *     responses:
 *       200:
 *         description: Vendor deleted successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", authMiddleware, requireRole("ADMIN"), VendorsController.delete);

export default router;
