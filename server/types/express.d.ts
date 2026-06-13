import { JwtPayload } from "jsonwebtoken";

export interface AuthenticatedUser {
  id: number;
  email: string;
  role: "admin" | "customer";
}

export interface AuthenticatedJwtPayload extends JwtPayload, AuthenticatedUser {}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  body: T | null;
  status: number;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationMeta;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }

    interface Response {
      success: <T>(
        message: string,
        body: T,
        status?: number,
        pagination?: {
          pageSize: number;
          pageNumber: number;
          totalItems: number;
          totalPages: number;
        },
      ) => Response;

      fail: <T>(message: string, body?: T, status?: number) => Response;
    }
  }
}

export {};
