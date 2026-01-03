import { Router } from "express";
import authRoutes from "./auth.routes.js";
import categoryRoutes from "./category.routes.js";
import productRoutes from "./product.routes.js";
import cartRoutes from "./cart.routes.js";
import adminRoutes from "./admin/index.js";
import orderRoutes from "./order.routes.js";
import addressRoutes from "./address.routes.js";
import reviewRoutes from "./review.routes.js";

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

// Cart routes - /api/cart
router.use("/cart", cartRoutes);

// Order routes - /api/orders
router.use("/orders", orderRoutes);

// Address routes - /api/addresses
router.use("/addresses", addressRoutes);

// Review routes - /api/reviews
router.use("/reviews", reviewRoutes);

// Admin routes - /api/admin
router.use("/admin", adminRoutes);

export { router as routes };
