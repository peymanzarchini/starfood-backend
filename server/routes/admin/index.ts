import { Router } from "express";
import { authenticate, adminOnly } from "../../middlewares/auth.middleware.js";
import adminCategoryRoutes from "./category.routes.js";
import adminProductRoutes from "./product.routes.js";
import adminOrderRoutes from "./order.routes.js";

const router = Router();

router.use(authenticate, adminOnly);

router.use("/categories", adminCategoryRoutes);

router.use("/products", adminProductRoutes);

router.use("/orders", adminOrderRoutes);

export default router;
