import { Router } from "express";
import { productController } from "../../controllers/product.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  createProductSchema,
  updateProductSchema,
  getProductByIdSchema,
} from "../../validators/schemas/product.schema.js";

const router = Router();

/**
 * @route   GET /api/admin/products
 * @desc    Get all products (including unavailable)
 * @access  Admin
 */
router.get("/", productController.getAllProductsAdmin.bind(productController));

/**
 * @route   GET /api/admin/products/:id
 * @desc    Get product by ID (including unavailable)
 * @access  Admin
 */
router.get(
  "/:id",
  validate(getProductByIdSchema),
  productController.getProductByIdAdmin.bind(productController)
);

/**
 * @route   POST /api/admin/products
 * @desc    Create new product
 * @access  Admin
 */
router.post(
  "/",
  validate(createProductSchema),
  productController.createProduct.bind(productController)
);

/**
 * @route   PUT /api/admin/products/:id
 * @desc    Update product
 * @access  Admin
 */
router.put(
  "/:id",
  validate(updateProductSchema),
  productController.updateProduct.bind(productController)
);

/**
 * @route   DELETE /api/admin/products/:id
 * @desc    Delete product
 * @access  Admin
 */
router.delete(
  "/:id",
  validate(getProductByIdSchema),
  productController.deleteProduct.bind(productController)
);

/**
 * @route   PATCH /api/admin/products/:id/toggle-availability
 * @desc    Toggle product availability
 * @access  Admin
 */
router.patch(
  "/:id/toggle-availability",
  validate(getProductByIdSchema),
  productController.toggleAvailability.bind(productController)
);

/**
 * @route   PATCH /api/admin/products/:id/toggle-popular
 * @desc    Toggle product popular status
 * @access  Admin
 */
router.patch(
  "/:id/toggle-popular",
  validate(getProductByIdSchema),
  productController.togglePopular.bind(productController)
);

// ============================================================
// PRODUCT IMAGES
// ============================================================

/**
 * @route   POST /api/admin/products/:id/images
 * @desc    Add image to product gallery
 * @access  Admin
 */
router.post(
  "/:id/images",
  validate(getProductByIdSchema),
  productController.addProductImage.bind(productController)
);

/**
 * @route   PUT /api/admin/products/:id/images/reorder
 * @desc    Reorder product images
 * @access  Admin
 */
router.put(
  "/:id/images/reorder",
  validate(getProductByIdSchema),
  productController.reorderProductImages.bind(productController)
);

/**
 * @route   PUT /api/admin/products/images/:imageId
 * @desc    Update product image
 * @access  Admin
 */
router.put("/images/:imageId", productController.updateProductImage.bind(productController));

/**
 * @route   DELETE /api/admin/products/images/:imageId
 * @desc    Delete product image
 * @access  Admin
 */
router.delete("/images/:imageId", productController.deleteProductImage.bind(productController));

export default router;
