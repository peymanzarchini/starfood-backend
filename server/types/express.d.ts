import { JwtPayload } from "jsonwebtoken";

/**
 * Authenticated user payload attached to request
 */
export interface AuthenticatedUser {
  id: number;
  email: string;
  role: "admin" | "customer";
}

/**
 * JWT payload with user data
 */
export interface AuthenticatedJwtPayload extends JwtPayload, AuthenticatedUser {}

/**
 * Standard API response format
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  body: T | null;
  status: number;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationMeta;
}

/**
 * Extend Express types
 */
declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }

    interface Response {
      /**
       * Send success response
       * @param message - Success message
       * @param body - Response data
       * @param status - HTTP status code (default: 200)
       */
      success: <T>(message: string, body: T, status?: number) => Response;

      /**
       * Send failure response
       * @param message - Error message
       * @param body - Additional error data
       * @param status - HTTP status code (default: 400)
       */
      fail: <T>(message: string, body?: T, status?: number) => Response;
    }
  }
}

export {};
