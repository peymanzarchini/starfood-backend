import { Router } from "express";
import { cartController } from "../controllers/cart.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  addToCartSchema,
  updateCartItemSchema,
  removeCartItemSchema,
} from "../validators/schemas/cart.schema.js";

const router = Router();

router.use(authenticate);

router.get("/preview-discount", cartController.previewDiscount.bind(cartController));

router.get("/", cartController.getCart.bind(cartController));

router.get("/count", cartController.getCartItemCount.bind(cartController));

router.get("/validate", cartController.validateCart.bind(cartController));

router.post("/items", validate(addToCartSchema), cartController.addItem.bind(cartController));

router.patch(
  "/items/:itemId",
  validate(updateCartItemSchema),
  cartController.updateItemQuantity.bind(cartController),
);

router.delete(
  "/items/:itemId",
  validate(removeCartItemSchema),
  cartController.removeItem.bind(cartController),
);

router.delete("/unavailable", cartController.removeUnavailableItems.bind(cartController));

router.delete("/", cartController.clearCart.bind(cartController));

export default router;
