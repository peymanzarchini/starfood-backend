import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service.js";
import {
  RegisterInput,
  LoginInput,
  ChangePasswordInput,
  UpdateProfileInput,
} from "../validators/schemas/auth.schema.js";
import {
  clearAccessTokenCookie,
  clearRefreshTokenCookie,
  COOKIE_NAMES,
  setAccessTokenCookie,
  setRefreshTokenCookie,
} from "../utils/cookie.js";
import { getPaginationMeta, normalizePagination } from "../utils/pagination.js";

class AuthController {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: RegisterInput = req.body;
      const user = await authService.register(data);
      res.success("Registration successful. Please login.", user, 201);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: LoginInput = req.body;
      const { user, accessToken, refreshToken } = await authService.login(data);
      setRefreshTokenCookie(res, refreshToken);

      setAccessTokenCookie(res, accessToken);

      res.success("Login successful", {
        user,
        accessToken,
      });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const refreshToken = req.cookies[COOKIE_NAMES.REFRESH_TOKEN];
      if (!refreshToken) {
        res.fail("Refresh token is required", null, 401);
        return;
      }
      const { accessToken, refreshToken: newRefreshToken } =
        await authService.refreshToken(refreshToken);
      setRefreshTokenCookie(res, newRefreshToken);
      setAccessTokenCookie(res, accessToken);
      res.success("Token refreshed successfully", { accessToken });
    } catch (error) {
      clearRefreshTokenCookie(res);
      clearAccessTokenCookie(res);
      next(error);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const data: UpdateProfileInput = req.body;

      const user = await authService.updateProfile(userId, data);

      res.success("Profile updated successfully", user);
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;

      const user = await authService.getProfile(userId);

      res.success("Profile retrieved successfully", user);
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const data: ChangePasswordInput = req.body;

      await authService.changePassword(userId, data);

      clearRefreshTokenCookie(res);

      res.success("Password changed successfully", null);
    } catch (error) {
      next(error);
    }
  }

  async logout(_req: Request, res: Response): Promise<void> {
    clearRefreshTokenCookie(res);
    clearAccessTokenCookie(res);
    res.success("Logout successful", null);
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = normalizePagination(Number(req.query.page), Number(req.query.limit));
      const filters = {
        search: req.query.search as string | undefined,
        role: req.query.role as "admin" | "customer" | undefined,
        status: req.query.status as "active" | "banned" | undefined,
      };

      const { items, totalItems } = await authService.getAllUsers(pagination, filters);
      const paginationMeta = getPaginationMeta(totalItems, pagination.page, pagination.limit);

      res.success("User retrieved successfully", items, 200, paginationMeta);
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const user = await authService.getUserById(id);
      res.success("User retrieved successfully", user);
    } catch (error) {
      next(error);
    }
  }

  async updateUserRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const { role } = req.body;
      const user = await authService.updateUserRole(id, role);
      res.success("User role updated successfully", user);
    } catch (error) {
      next(error);
    }
  }

  async toggleUserStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const user = await authService.toggleUserStatus(id);
      res.success("User status toggled successfully", user);
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
