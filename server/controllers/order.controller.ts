import { Request, Response, NextFunction } from "express";
import { orderService } from "../services/order.service.js";
import { getPaginationMeta, normalizePagination } from "../utils/pagination.js";
import {
  CreateOrderInput,
  UpdateOrderStatusInput,
  OrderStatusType,
} from "../validators/schemas/order.schema.js";

class OrderController {
  async getUserOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const pagination = normalizePagination(Number(req.query.page), Number(req.query.limit));
      const status = req.query.status as OrderStatusType | undefined;

      const { items, totalItems } = await orderService.getUserOrders(userId, pagination, status);
      const paginationMeta = getPaginationMeta(totalItems, pagination.page, pagination.limit);

      res.success("Orders retrieved successfully", items, 200, paginationMeta);
    } catch (error) {
      next(error);
    }
  }

  async getOrderById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const orderId = parseInt(req.params.id, 10);

      const order = await orderService.getOrderById(orderId, userId);

      res.success("Order retrieved successfully", order);
    } catch (error) {
      next(error);
    }
  }

  async createOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const data: CreateOrderInput = req.body;

      const order = await orderService.createOrder(userId, data);

      res.success("Order created successfully", order, 201);
    } catch (error) {
      next(error);
    }
  }

  async cancelOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const orderId = parseInt(req.params.id, 10);

      const order = await orderService.cancelOrder(orderId, userId);

      res.success("Order cancelled successfully", order);
    } catch (error) {
      next(error);
    }
  }

  async getAllOrdersAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = normalizePagination(Number(req.query.page), Number(req.query.limit));

      const filters = {
        status: req.query.status as OrderStatusType | undefined,
        startDate: req.query.startDate as string | undefined,
        endDate: req.query.endDate as string | undefined,
        search: req.query.search as string | undefined,
      };

      const { items, totalItems } = await orderService.getAllOrdersAdmin(pagination, filters);
      const paginationMeta = getPaginationMeta(totalItems, pagination.page, pagination.limit);

      res.success("Orders retrieved successfully", items, 200, paginationMeta);
    } catch (error) {
      next(error);
    }
  }

  async getOrderByIdAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orderId = parseInt(req.params.id, 10);

      const order = await orderService.getOrderByIdAdmin(orderId);

      res.success("Order retrieved successfully", order);
    } catch (error) {
      next(error);
    }
  }

  async updateOrderStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orderId = parseInt(req.params.id, 10);
      const data: UpdateOrderStatusInput = req.body;

      const order = await orderService.updateOrderStatus(orderId, data);

      res.success("Order status updated successfully", order);
    } catch (error) {
      next(error);
    }
  }

  async getOrderStats(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await orderService.getOrderStats();

      res.success("Order statistics retrieved successfully", stats);
    } catch (error) {
      next(error);
    }
  }
}

export const orderController = new OrderController();
