import { Router } from "express";
import { orderController } from "../controllers/order.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createOrderSchema, getOrderSchema } from "../validators/schemas/order.schema.js";

const router = Router();

router.use(authenticate);

router.get("/", orderController.getUserOrders.bind(orderController));

router.post("/", validate(createOrderSchema), orderController.createOrder.bind(orderController));

router.get("/:id", validate(getOrderSchema), orderController.getOrderById.bind(orderController));

router.post(
  "/:id/cancel",
  validate(getOrderSchema),
  orderController.cancelOrder.bind(orderController),
);

export default router;
