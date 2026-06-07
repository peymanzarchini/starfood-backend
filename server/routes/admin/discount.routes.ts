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

router.get("/stats", discountController.getDiscountStats.bind(discountController));

router.get(
  "/",
  validate(getDiscountsSchema),
  discountController.getAllDiscounts.bind(discountController),
);

router.get(
  "/:id",
  validate(getDiscountByIdSchema),
  discountController.getDiscountById.bind(discountController),
);

router.post(
  "/",
  validate(createDiscountSchema),
  discountController.createDiscount.bind(discountController),
);

router.put(
  "/:id",
  validate(updateDiscountSchema),
  discountController.updateDiscount.bind(discountController),
);

router.delete(
  "/:id",
  validate(getDiscountByIdSchema),
  discountController.deleteDiscount.bind(discountController),
);

router.patch(
  "/:id/toggle",
  validate(getDiscountByIdSchema),
  discountController.toggleDiscountStatus.bind(discountController),
);

export default router;
