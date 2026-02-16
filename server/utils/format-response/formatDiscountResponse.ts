import { Discount } from "../../models/discount.model.js";
import { DiscountResponse } from "../../types/index.js";

export function formatDiscountResponse(discount: Discount): DiscountResponse {
  return {
    id: discount.id,
    code: discount.code,
    type: discount.type,
    value: discount.value,
    minOrderAmount: discount.minOrderAmount,
    maxDiscountAmount: discount.maxDiscountAmount,
    usageLimit: discount.usageLimit,
    usedCount: discount.usedCount,
    startDate: discount.startDate,
    expireDate: discount.expireDate,
    isActive: discount.isActive,
    isValid: discount.isValid(),
    createdAt: discount.createdAt!,
    updatedAt: discount.updatedAt!,
  };
}
