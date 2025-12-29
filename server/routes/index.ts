import { Router } from "express";
import authRoutes from "./auth.routes.js";
import categoryRoutes from "./category.routes.js";
import productRoutes from "./product.routes.js";
import adminRoutes from "./admin/index.js";

const router = Router();

/**
 * API Routes
 */

// Auth routes - /api/auth
router.use("/auth", authRoutes);

// Category routes - /api/categories
router.use("/categories", categoryRoutes);

// Product routes - /api/products
router.use("/products", productRoutes);

// Admin routes - /api/admin
router.use("/admin", adminRoutes);

export { router as routes };
