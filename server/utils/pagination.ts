import { PaginationMeta, PaginatedResponse } from "../types/express.js";

/**
 * Pagination options interface
 */
export interface PaginationOptions {
  page: number;
  limit: number;
}

/**
 * Calculate pagination metadata
 * @param totalItems - Total number of items
 * @param page - Current page number
 * @param limit - Items per page
 */
export function getPaginationMeta(totalItems: number, page: number, limit: number): PaginationMeta {
  const totalPages = Math.ceil(totalItems / limit);

  return {
    currentPage: page,
    totalPages,
    totalItems,
    itemsPerPage: limit,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}

/**
 * Create paginated response
 * @param items - Array of items
 * @param totalItems - Total count of items
 * @param page - Current page
 * @param limit - Items per page
 */
export function paginate<T>(
  items: T[],
  totalItems: number,
  page: number,
  limit: number
): PaginatedResponse<T> {
  return {
    items,
    pagination: getPaginationMeta(totalItems, page, limit),
  };
}

/**
 * Calculate offset for database query
 * @param page - Page number (1-indexed)
 * @param limit - Items per page
 */
export function getOffset(page: number, limit: number): number {
  return (page - 1) * limit;
}

/**
 * Normalize pagination params
 * Ensures valid page and limit values
 */
export function normalizePagination(page?: number, limit?: number): PaginationOptions {
  return {
    page: Math.max(1, page || 1),
    limit: Math.min(100, Math.max(1, limit || 10)),
  };
}
