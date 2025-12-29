import { Router } from "express";
import { authenticate, adminOnly } from "../../middlewares/auth.middleware.js";
import adminCategoryRoutes from "./category.routes.js";

const router = Router();

router.use(authenticate, adminOnly);

router.use("/categories", adminCategoryRoutes);

export default router;
