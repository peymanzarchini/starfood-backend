import { Router } from "express";
import { productController } from "../controllers/product.controller.js";
import { reviewController } from "../controllers/review.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { getProductByIdSchema } from "../validators/schemas/product.schema.js";

const router = Router();

router.get("/", productController.getProducts.bind(productController));

router.get("/popular", productController.getPopularProducts.bind(productController));

router.get("/discounted", productController.getDiscountedProducts.bind(productController));

router.get(
  "/:id",
  validate(getProductByIdSchema),
  productController.getProductById.bind(productController),
);

router.get("/:productId/reviews", reviewController.getProductReviews.bind(reviewController));

export default router;
