export interface PaginationOptions {
  page: number;
  limit: number;
}

export function getPaginationMeta(totalItems: number, page: number, limit: number) {
  const totalPages = Math.ceil(totalItems / limit) || 1;
  return {
    pageSize: limit,
    pageNumber: page,
    totalItems,
    totalPages,
  };
}

export function getOffset(page: number, limit: number): number {
  return (page - 1) * limit;
}

export function normalizePagination(page?: number, limit?: number): PaginationOptions {
  return {
    page: Math.max(1, page || 1),
    limit: Math.min(100, Math.max(1, limit || 10)),
  };
}
