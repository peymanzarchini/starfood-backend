import { Request, Response, NextFunction } from "express";
import { discountService } from "../services/discount.service.js";
import { getPaginationMeta, normalizePagination } from "../utils/pagination.js";
import {
  CreateDiscountInput,
  UpdateDiscountInput,
  ValidateDiscountInput,
} from "../validators/schemas/index.js";

class DiscountController {
  async getAllDiscounts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = normalizePagination(Number(req.query.page), Number(req.query.limit));
      const filters = {
        isActive:
          req.query.isActive === "true" ? true : req.query.isActive === "false" ? false : undefined,
        search: req.query.search as string | undefined,
      };

      const { items, totalItems } = await discountService.getAllDiscounts(pagination, filters);
      const paginationMeta = getPaginationMeta(totalItems, pagination.page, pagination.limit);

      res.success("Discounts retrieved successfully", items, 200, paginationMeta);
    } catch (error) {
      next(error);
    }
  }

  async getDiscountById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const discountId = parseInt(req.params.id, 10);
      const discount = await discountService.getDiscountById(discountId);
      res.success("Discount retrieved successfully", discount);
    } catch (error) {
      next(error);
    }
  }

  async createDiscount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: CreateDiscountInput = req.body;

      const discount = await discountService.createDiscount(data);

      res.success("Discount created successfully", discount, 201);
    } catch (error) {
      next(error);
    }
  }

  async updateDiscount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const discountId = parseInt(req.params.id, 10);
      const data: UpdateDiscountInput = req.body;

      const discount = await discountService.updateDiscount(discountId, data);

      res.success("Discount updated successfully", discount);
    } catch (error) {
      next(error);
    }
  }

  async deleteDiscount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const discountId = parseInt(req.params.id, 10);

      await discountService.deleteDiscount(discountId);

      res.success("Discount deleted successfully", null);
    } catch (error) {
      next(error);
    }
  }

  async toggleDiscountStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const discountId = parseInt(req.params.id, 10);

      const discount = await discountService.toggleDiscountStatus(discountId);

      const message = discount.isActive
        ? "Discount activated successfully"
        : "Discount deactivated successfully";

      res.success(message, discount);
    } catch (error) {
      next(error);
    }
  }

  async getDiscountStats(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await discountService.getDiscountStats();

      res.success("Discount statistics retrieved successfully", stats);
    } catch (error) {
      next(error);
    }
  }

  async validateDiscount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: ValidateDiscountInput = req.body;

      const result = await discountService.validateDiscount(data);

      res.success("Discount validation completed", result);
    } catch (error) {
      next(error);
    }
  }
}

export const discountController = new DiscountController();
