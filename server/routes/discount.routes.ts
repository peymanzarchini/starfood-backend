import { Router } from "express";
import { discountController } from "../controllers/discount.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { validateDiscountSchema } from "../validators/schemas/discount.schema.js";

const router = Router();

/**
 * @route   POST /api/discounts/validate
 * @desc    Validate a discount code
 * @access  Public
 */
router.post(
  "/validate",
  validate(validateDiscountSchema),
  discountController.validateDiscount.bind(discountController),
);

export default router;
