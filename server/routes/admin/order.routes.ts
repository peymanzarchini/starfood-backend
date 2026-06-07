import { Router } from "express";
import { orderController } from "../../controllers/order.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { getOrderSchema, updateOrderStatusSchema } from "../../validators/schemas/order.schema.js";

const router = Router();

router.get("/stats", orderController.getOrderStats.bind(orderController));

router.get("/", orderController.getAllOrdersAdmin.bind(orderController));

router.get(
  "/:id",
  validate(getOrderSchema),
  orderController.getOrderByIdAdmin.bind(orderController),
);

router.patch(
  "/:id/status",
  validate(updateOrderStatusSchema),
  orderController.updateOrderStatus.bind(orderController),
);

export default router;
