import { Router } from "express";
import { authenticate, adminOnly } from "../../middlewares/auth.middleware.js";
import adminCategoryRoutes from "./category.routes.js";
import adminProductRoutes from "./product.routes.js";

const router = Router();

router.use(authenticate, adminOnly);

router.use("/categories", adminCategoryRoutes);

router.use("/products", adminProductRoutes);

export default router;
