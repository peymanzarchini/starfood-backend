import { Router } from "express";
import { categoryController } from "../../controllers/category.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  createCategorySchema,
  updateCategorySchema,
  getCategoryByIdSchema,
} from "../../validators/schemas/category.schema.js";

const router = Router();

router.get("/", categoryController.getAllCategories.bind(categoryController));
router.get(
  "/:id",
  validate(getCategoryByIdSchema),
  categoryController.getCategoryByIdAdmin.bind(categoryController)
);
router.post(
  "/",
  validate(createCategorySchema),
  categoryController.createCategory.bind(categoryController)
);
router.put("/reorder", categoryController.reorderCategories.bind(categoryController));
router.put(
  "/:id",
  validate(updateCategorySchema),
  categoryController.updateCategory.bind(categoryController)
);
router.delete(
  "/:id",
  validate(getCategoryByIdSchema),
  categoryController.deleteCategory.bind(categoryController)
);

export default router;
