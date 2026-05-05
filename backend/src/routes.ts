import { Router } from "express";
import vendorsRoutes from "./modules/vendors/vendors.routes";
import authRoutes from "./modules/auth/auth.routes";
import agentsRoutes from "./modules/agents/agents.routes";
import adminRoutes from "./modules/admin/admin.routes";
import mealsRoutes from "./modules/meals/meals.routes";
import ordersRoutes from "./modules/orders/orders.routes";
import uploadsRoutes from "./modules/uploads/uploads.routes";
import { authMiddleware, requireRole } from "./middlewares/auth.middleware";


const router = Router();
router.use('/vendors', vendorsRoutes);
router.use('/auth', authRoutes);
router.use('/agents', agentsRoutes);
router.use('/admin', adminRoutes);
router.use('/meals', mealsRoutes);
router.use('/orders', ordersRoutes);
router.use('/uploads', uploadsRoutes);

export default router;
