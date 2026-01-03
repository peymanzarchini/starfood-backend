import { Router } from "express";
import { orderController } from "../controllers/order.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createOrderSchema, getOrderSchema } from "../validators/schemas/order.schema.js";

const router = Router();

/**
 * All order routes require authentication
 */
router.use(authenticate);

/**
 * @route   GET /api/orders
 * @desc    Get user's orders
 * @access  Private
 */
router.get("/", orderController.getUserOrders.bind(orderController));

/**
 * @route   POST /api/orders
 * @desc    Create order from cart
 * @access  Private
 */
router.post("/", validate(createOrderSchema), orderController.createOrder.bind(orderController));

/**
 * @route   GET /api/orders/:id
 * @desc    Get order by ID
 * @access  Private
 */
router.get("/:id", validate(getOrderSchema), orderController.getOrderById.bind(orderController));

/**
 * @route   POST /api/orders/:id/cancel
 * @desc    Cancel order
 * @access  Private
 */
router.post(
  "/:id/cancel",
  validate(getOrderSchema),
  orderController.cancelOrder.bind(orderController)
);

export default router;
