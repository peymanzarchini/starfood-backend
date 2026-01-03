import { Router } from "express";
import { orderController } from "../../controllers/order.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { getOrderSchema, updateOrderStatusSchema } from "../../validators/schemas/order.schema.js";

const router = Router();

/**
 * @route   GET /api/admin/orders/stats
 * @desc    Get order statistics
 * @access  Admin
 */
router.get("/stats", orderController.getOrderStats.bind(orderController));

/**
 * @route   GET /api/admin/orders
 * @desc    Get all orders
 * @access  Admin
 */
router.get("/", orderController.getAllOrdersAdmin.bind(orderController));

/**
 * @route   GET /api/admin/orders/:id
 * @desc    Get order by ID
 * @access  Admin
 */
router.get(
  "/:id",
  validate(getOrderSchema),
  orderController.getOrderByIdAdmin.bind(orderController)
);

/**
 * @route   PATCH /api/admin/orders/:id/status
 * @desc    Update order status
 * @access  Admin
 */
router.patch(
  "/:id/status",
  validate(updateOrderStatusSchema),
  orderController.updateOrderStatus.bind(orderController)
);

export default router;
