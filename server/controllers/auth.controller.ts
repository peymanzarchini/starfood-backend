import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service.js";
import {
  RegisterInput,
  LoginInput,
  ChangePasswordInput,
  UpdateProfileInput,
} from "../validators/schemas/auth.schema.js";
import { clearRefreshTokenCookie, COOKIE_NAMES, setRefreshTokenCookie } from "../utils/cookie.js";

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
      const { accessToken, refreshToken: newRefreshToken } = await authService.refreshToken(
        refreshToken
      );
      setRefreshTokenCookie(res, newRefreshToken);
      res.success("Token refreshed successfully", { accessToken });
    } catch (error) {
      clearRefreshTokenCookie(res);
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
    res.success("Logout successful", null);
  }
}

export const authController = new AuthController();
