import { Router } from "express";
import { categoryController } from "../controllers/category.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { getCategoryByIdSchema } from "../validators/schemas/category.schema.js";

const router = Router();

router.get("/", categoryController.getActiveCategories.bind(categoryController));
router.get(
  "/:id",
  validate(getCategoryByIdSchema),
  categoryController.getCategoryById.bind(categoryController)
);
router.get(
  "/:id/products",
  validate(getCategoryByIdSchema),
  categoryController.getCategoryProducts.bind(categoryController)
);
router.get(
  "/:id/products",
  validate(getCategoryByIdSchema),
  categoryController.getCategoryProducts.bind(categoryController)
);

export default router;
