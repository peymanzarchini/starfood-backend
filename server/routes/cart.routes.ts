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

/**
 * All cart routes require authentication
 */
router.use(authenticate);

/**
 * @route   GET /api/cart
 * @desc    Get user's cart
 * @access  Private
 */
router.get("/", cartController.getCart.bind(cartController));

/**
 * @route   GET /api/cart/count
 * @desc    Get cart item count (for header badge)
 * @access  Private
 */
router.get("/count", cartController.getCartItemCount.bind(cartController));

/**
 * @route   GET /api/cart/validate
 * @desc    Validate cart before checkout
 * @access  Private
 */
router.get("/validate", cartController.validateCart.bind(cartController));

/**
 * @route   POST /api/cart/items
 * @desc    Add item to cart
 * @access  Private
 */
router.post("/items", validate(addToCartSchema), cartController.addItem.bind(cartController));

/**
 * @route   PATCH /api/cart/items/:itemId
 * @desc    Update cart item quantity
 * @access  Private
 */
router.patch(
  "/items/:itemId",
  validate(updateCartItemSchema),
  cartController.updateItemQuantity.bind(cartController)
);

/**
 * @route   DELETE /api/cart/items/:itemId
 * @desc    Remove item from cart
 * @access  Private
 */
router.delete(
  "/items/:itemId",
  validate(removeCartItemSchema),
  cartController.removeItem.bind(cartController)
);

/**
 * @route   DELETE /api/cart/unavailable
 * @desc    Remove unavailable items from cart
 * @access  Private
 */
router.delete("/unavailable", cartController.removeUnavailableItems.bind(cartController));

/**
 * @route   DELETE /api/cart
 * @desc    Clear all items from cart
 * @access  Private
 */
router.delete("/", cartController.clearCart.bind(cartController));

export default router;
