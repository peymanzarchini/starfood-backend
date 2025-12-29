import { Category } from "../models/category.model.js";
import { CategoryResponse } from "../types/index.js";

export function formatCategoryResponse(
  category: Category,
  productCount?: number
): CategoryResponse {
  return {
    id: category.id,
    name: category.name,
    description: category.description,
    imageUrl: category.imageUrl,
    displayOrder: category.displayOrder,
    isActive: category.isActive,
    ...(productCount !== undefined && { productCount }),
  };
}
