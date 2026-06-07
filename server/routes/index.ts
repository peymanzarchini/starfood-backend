import { Router } from "express";
import authRoutes from "./auth.routes.js";
import categoryRoutes from "./category.routes.js";
import productRoutes from "./product.routes.js";
import cartRoutes from "./cart.routes.js";
import adminRoutes from "./admin/index.js";
import orderRoutes from "./order.routes.js";
import addressRoutes from "./address.routes.js";
import reviewRoutes from "./review.routes.js";
import favoritesRoutes from "./favorite.routes.js";
import discountRoutes from "./discount.routes.js";

const router = Router();

router.use("/auth", authRoutes);

router.use("/categories", categoryRoutes);

router.use("/products", productRoutes);

router.use("/cart", cartRoutes);

router.use("/orders", orderRoutes);

router.use("/addresses", addressRoutes);

router.use("/reviews", reviewRoutes);

router.use("/favorites", favoritesRoutes);

router.use("/discounts", discountRoutes);

router.use("/admin", adminRoutes);

export { router as routes };
