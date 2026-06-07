import { Router } from "express";
import { discountController } from "../controllers/discount.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { validateDiscountSchema } from "../validators/schemas/discount.schema.js";

const router = Router();

router.post(
  "/validate",
  validate(validateDiscountSchema),
  discountController.validateDiscount.bind(discountController),
);

export default router;
