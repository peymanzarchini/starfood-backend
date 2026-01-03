import { Request, Response, NextFunction } from "express";
import { orderService } from "../services/order.service.js";
import { normalizePagination } from "../utils/pagination.js";
import {
  CreateOrderInput,
  UpdateOrderStatusInput,
  OrderStatusType,
} from "../validators/schemas/order.schema.js";

/**
 * Order Controller
 * Handles HTTP requests for orders
 */
class OrderController {
  // ============================================================
  // USER ENDPOINTS
  // ============================================================

  /**
   * Get user's orders
   * GET /api/orders
   */
  async getUserOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const pagination = normalizePagination(Number(req.query.page), Number(req.query.limit));
      const status = req.query.status as OrderStatusType | undefined;

      const result = await orderService.getUserOrders(userId, pagination, status);

      res.success("Orders retrieved successfully", result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get order by ID
   * GET /api/orders/:id
   */
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

  /**
   * Create order from cart
   * POST /api/orders
   */
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

  /**
   * Cancel order
   * POST /api/orders/:id/cancel
   */
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

  // ============================================================
  // ADMIN ENDPOINTS
  // ============================================================

  /**
   * Get all orders (admin)
   * GET /api/admin/orders
   */
  async getAllOrdersAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = normalizePagination(Number(req.query.page), Number(req.query.limit));

      const filters = {
        status: req.query.status as OrderStatusType | undefined,
        startDate: req.query.startDate as string | undefined,
        endDate: req.query.endDate as string | undefined,
        search: req.query.search as string | undefined,
      };

      const result = await orderService.getAllOrdersAdmin(pagination, filters);

      res.success("Orders retrieved successfully", result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get order by ID (admin)
   * GET /api/admin/orders/:id
   */
  async getOrderByIdAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orderId = parseInt(req.params.id, 10);

      const order = await orderService.getOrderByIdAdmin(orderId);

      res.success("Order retrieved successfully", order);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update order status (admin)
   * PATCH /api/admin/orders/:id/status
   */
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

  /**
   * Get order statistics (admin)
   * GET /api/admin/orders/stats
   */
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
