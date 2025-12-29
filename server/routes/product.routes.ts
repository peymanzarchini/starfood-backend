import { Router } from "express";
import { productController } from "../controllers/product.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { getProductByIdSchema } from "../validators/schemas/product.schema.js";

const router = Router();

/**
 * @route   GET /api/products
 * @desc    Get products with filters and pagination
 * @access  Public
 */
router.get("/", productController.getProducts.bind(productController));

/**
 * @route   GET /api/products/popular
 * @desc    Get popular products
 * @access  Public
 */
router.get("/popular", productController.getPopularProducts.bind(productController));

/**
 * @route   GET /api/products/discounted
 * @desc    Get discounted products
 * @access  Public
 */
router.get("/discounted", productController.getDiscountedProducts.bind(productController));

/**
 * @route   GET /api/products/:id
 * @desc    Get product by ID with gallery
 * @access  Public
 */
router.get(
  "/:id",
  validate(getProductByIdSchema),
  productController.getProductById.bind(productController)
);

export default router;
