import { Op } from "@sequelize/core";
import { Discount } from "../models/index.js";
import { HttpError } from "../utils/httpError.js";
import { paginate, getOffset, PaginationOptions } from "../utils/pagination.js";
import {
  CreateDiscountInput,
  UpdateDiscountInput,
  ValidateDiscountInput,
} from "../validators/schemas/index.js";
import { formatDiscountResponse } from "../utils/format-response/formatDiscountResponse.js";
import { DiscountResponse, ValidateDiscountResponse } from "../types/index.js";

class DiscountService {
  /**
   * Get all discounts (admin)
   */
  async getAllDiscounts(
    pagination: PaginationOptions,
    filters?: {
      isActive?: boolean;
      search?: string;
    },
  ) {
    const { page, limit } = pagination;
    const offset = getOffset(page, limit);

    const where: Record<string, unknown> = {};

    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    if (filters?.search) {
      where.code = { [Op.like]: `%${filters.search.toUpperCase()}%` };
    }

    const { count, rows } = await Discount.findAndCountAll({
      where,
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    const discounts = rows.map(formatDiscountResponse);

    return paginate(discounts, count, page, limit);
  }

  /**
   * Get discount by ID (admin)
   */
  async getDiscountById(discountId: number): Promise<DiscountResponse> {
    const discount = await Discount.findByPk(discountId);

    if (!discount) {
      throw HttpError.notFound("Discount not found");
    }

    return formatDiscountResponse(discount);
  }

  /**
   * Create discount (admin)
   */
  async createDiscount(data: CreateDiscountInput): Promise<DiscountResponse> {
    // Check if code already exists
    const existingDiscount = await Discount.findOne({
      where: { code: data.code },
    });

    if (existingDiscount) {
      throw HttpError.conflict("Discount code already exists");
    }

    const discount = await Discount.create({
      code: data.code,
      type: data.type,
      value: data.value,
      minOrderAmount: data.minOrderAmount ?? 0,
      maxDiscountAmount: data.maxDiscountAmount ?? null,
      usageLimit: data.usageLimit ?? 1,
      usedCount: 0,
      startDate: data.startDate ?? new Date(),
      expireDate: data.expireDate,
      isActive: data.isActive ?? true,
    });

    return formatDiscountResponse(discount);
  }

  /**
   * Update discount (admin)
   */
  async updateDiscount(discountId: number, data: UpdateDiscountInput): Promise<DiscountResponse> {
    const discount = await Discount.findByPk(discountId);

    if (!discount) {
      throw HttpError.notFound("Discount not found");
    }

    // Check if new code already exists (if changing code)
    if (data.code && data.code !== discount.code) {
      const existingDiscount = await Discount.findOne({
        where: { code: data.code },
      });

      if (existingDiscount) {
        throw HttpError.conflict("Discount code already exists");
      }
    }

    await discount.update({
      code: data.code ?? discount.code,
      type: data.type ?? discount.type,
      value: data.value ?? discount.value,
      minOrderAmount: data.minOrderAmount ?? discount.minOrderAmount,
      maxDiscountAmount: data.maxDiscountAmount ?? discount.maxDiscountAmount,
      usageLimit: data.usageLimit ?? discount.usageLimit,
      startDate: data.startDate ?? discount.startDate,
      expireDate: data.expireDate ?? discount.expireDate,
      isActive: data.isActive ?? discount.isActive,
    });

    return formatDiscountResponse(discount);
  }

  /**
   * Delete discount (admin)
   */
  async deleteDiscount(discountId: number): Promise<void> {
    const discount = await Discount.findByPk(discountId);

    if (!discount) {
      throw HttpError.notFound("Discount not found");
    }

    await discount.destroy();
  }

  /**
   * Toggle discount active status (admin)
   */
  async toggleDiscountStatus(discountId: number): Promise<DiscountResponse> {
    const discount = await Discount.findByPk(discountId);

    if (!discount) {
      throw HttpError.notFound("Discount not found");
    }

    await discount.update({ isActive: !discount.isActive });

    return formatDiscountResponse(discount);
  }

  /**
   * Validate discount code (public)
   * Checks if code is valid and calculates discount amount
   */
  async validateDiscount(data: ValidateDiscountInput): Promise<ValidateDiscountResponse> {
    const discount = await Discount.findOne({
      where: { code: data.code },
    });

    if (!discount) {
      throw HttpError.notFound("Invalid discount code");
    }

    // Check if active
    if (!discount.isActive) {
      return {
        isValid: false,
        discount: {
          code: discount.code,
          type: discount.type,
          value: discount.value,
          minOrderAmount: discount.minOrderAmount,
          maxDiscountAmount: discount.maxDiscountAmount,
        },
        calculatedDiscount: 0,
        message: "This discount code is not active",
      };
    }

    // Check date validity
    const now = new Date();
    if (discount.startDate > now) {
      return {
        isValid: false,
        discount: {
          code: discount.code,
          type: discount.type,
          value: discount.value,
          minOrderAmount: discount.minOrderAmount,
          maxDiscountAmount: discount.maxDiscountAmount,
        },
        calculatedDiscount: 0,
        message: "This discount code is not yet active",
      };
    }

    if (discount.expireDate <= now) {
      return {
        isValid: false,
        discount: {
          code: discount.code,
          type: discount.type,
          value: discount.value,
          minOrderAmount: discount.minOrderAmount,
          maxDiscountAmount: discount.maxDiscountAmount,
        },
        calculatedDiscount: 0,
        message: "This discount code has expired",
      };
    }

    // Check usage limit
    if (discount.usedCount >= discount.usageLimit) {
      return {
        isValid: false,
        discount: {
          code: discount.code,
          type: discount.type,
          value: discount.value,
          minOrderAmount: discount.minOrderAmount,
          maxDiscountAmount: discount.maxDiscountAmount,
        },
        calculatedDiscount: 0,
        message: "This discount code has reached its usage limit",
      };
    }

    // Check minimum order amount
    if (data.orderAmount < discount.minOrderAmount) {
      return {
        isValid: false,
        discount: {
          code: discount.code,
          type: discount.type,
          value: discount.value,
          minOrderAmount: discount.minOrderAmount,
          maxDiscountAmount: discount.maxDiscountAmount,
        },
        calculatedDiscount: 0,
        message: `Minimum order amount for this code is ${discount.minOrderAmount.toLocaleString()} تومان`,
      };
    }

    // Calculate discount
    const calculatedDiscount = discount.calculateDiscount(data.orderAmount);

    return {
      isValid: true,
      discount: {
        code: discount.code,
        type: discount.type,
        value: discount.value,
        minOrderAmount: discount.minOrderAmount,
        maxDiscountAmount: discount.maxDiscountAmount,
      },
      calculatedDiscount,
      message:
        discount.type === "percentage"
          ? `${discount.value}% discount applied - ${calculatedDiscount.toLocaleString()} تومان off`
          : `${calculatedDiscount.toLocaleString()} تومان discount applied`,
    };
  }

  /**
   * Get discount statistics (admin)
   */
  async getDiscountStats(): Promise<{
    total: number;
    active: number;
    expired: number;
    exhausted: number;
    totalUsed: number;
  }> {
    const now = new Date();

    // Get all discounts and calculate stats in JS to avoid deprecated literal
    const allDiscounts = await Discount.findAll({
      attributes: ["id", "isActive", "expireDate", "usedCount", "usageLimit"],
    });

    const total = allDiscounts.length;
    const active = allDiscounts.filter((d) => d.isActive && d.expireDate > now).length;
    const expired = allDiscounts.filter((d) => d.expireDate <= now).length;
    const exhausted = allDiscounts.filter((d) => d.usedCount >= d.usageLimit).length;
    const totalUsed = allDiscounts.reduce((sum, d) => sum + d.usedCount, 0);

    return {
      total,
      active,
      expired,
      exhausted,
      totalUsed,
    };
  }

  /**
   * Increment usage count
   * Called internally when an order is placed with a discount
   */
  async incrementUsage(discountId: number): Promise<void> {
    await Discount.increment("usedCount", { by: 1, where: { id: discountId } });
  }
}

export const discountService = new DiscountService();
