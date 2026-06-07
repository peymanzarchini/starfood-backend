import { Router } from "express";
import { productController } from "../../controllers/product.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  createProductSchema,
  updateProductSchema,
  getProductByIdSchema,
} from "../../validators/schemas/product.schema.js";

const router = Router();

router.get("/", productController.getAllProductsAdmin.bind(productController));

router.get(
  "/:id",
  validate(getProductByIdSchema),
  productController.getProductByIdAdmin.bind(productController),
);

router.post(
  "/",
  validate(createProductSchema),
  productController.createProduct.bind(productController),
);

router.put(
  "/:id",
  validate(updateProductSchema),
  productController.updateProduct.bind(productController),
);

router.delete(
  "/:id",
  validate(getProductByIdSchema),
  productController.deleteProduct.bind(productController),
);

router.patch(
  "/:id/toggle-availability",
  validate(getProductByIdSchema),
  productController.toggleAvailability.bind(productController),
);

router.patch(
  "/:id/toggle-popular",
  validate(getProductByIdSchema),
  productController.togglePopular.bind(productController),
);

router.post(
  "/:id/images",
  validate(getProductByIdSchema),
  productController.addProductImage.bind(productController),
);

router.put(
  "/:id/images/reorder",
  validate(getProductByIdSchema),
  productController.reorderProductImages.bind(productController),
);

router.put("/images/:imageId", productController.updateProductImage.bind(productController));

router.delete("/images/:imageId", productController.deleteProductImage.bind(productController));

export default router;
