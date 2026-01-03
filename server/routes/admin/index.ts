import { Router } from "express";
import { authenticate, adminOnly } from "../../middlewares/auth.middleware.js";
import adminCategoryRoutes from "./category.routes.js";
import adminProductRoutes from "./product.routes.js";
import adminOrderRoutes from "./order.routes.js";
import adminReviewRoutes from "./review.routes.js";

const router = Router();

router.use(authenticate, adminOnly);

router.use("/categories", adminCategoryRoutes);

router.use("/products", adminProductRoutes);

router.use("/orders", adminOrderRoutes);

router.use("/reviews", adminReviewRoutes);

export default router;
