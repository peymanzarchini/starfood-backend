import { Router } from "express";
import { discountController } from "../../controllers/discount.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  createDiscountSchema,
  updateDiscountSchema,
  getDiscountByIdSchema,
  getDiscountsSchema,
} from "../../validators/schemas/discount.schema.js";

const router = Router();

/**
 * @route   GET /api/admin/discounts/stats
 * @desc    Get discount statistics
 * @access  Admin
 */
router.get("/stats", discountController.getDiscountStats.bind(discountController));

/**
 * @route   GET /api/admin/discounts
 * @desc    Get all discounts with pagination
 * @access  Admin
 */
router.get(
  "/",
  validate(getDiscountsSchema),
  discountController.getAllDiscounts.bind(discountController),
);

/**
 * @route   GET /api/admin/discounts/:id
 * @desc    Get discount by ID
 * @access  Admin
 */
router.get(
  "/:id",
  validate(getDiscountByIdSchema),
  discountController.getDiscountById.bind(discountController),
);

/**
 * @route   POST /api/admin/discounts
 * @desc    Create new discount
 * @access  Admin
 */
router.post(
  "/",
  validate(createDiscountSchema),
  discountController.createDiscount.bind(discountController),
);

/**
 * @route   PUT /api/admin/discounts/:id
 * @desc    Update discount
 * @access  Admin
 */
router.put(
  "/:id",
  validate(updateDiscountSchema),
  discountController.updateDiscount.bind(discountController),
);

/**
 * @route   DELETE /api/admin/discounts/:id
 * @desc    Delete discount
 * @access  Admin
 */
router.delete(
  "/:id",
  validate(getDiscountByIdSchema),
  discountController.deleteDiscount.bind(discountController),
);

/**
 * @route   PATCH /api/admin/discounts/:id/toggle
 * @desc    Toggle discount active status
 * @access  Admin
 */
router.patch(
  "/:id/toggle",
  validate(getDiscountByIdSchema),
  discountController.toggleDiscountStatus.bind(discountController),
);

export default router;
