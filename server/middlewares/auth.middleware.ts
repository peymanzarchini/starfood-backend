import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { HttpError } from "../utils/httpError.js";
import { AuthenticatedJwtPayload } from "../types/express.js";

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
export const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw HttpError.unauthorized("Access token is required");
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw HttpError.unauthorized("Access token is required");
    }

    // Verify token
    const decoded = jwt.verify(token, env.jwt.secret) as AuthenticatedJwtPayload;

    // Attach user to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      next(HttpError.unauthorized("Token has expired"));
      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      next(HttpError.unauthorized("Invalid token"));
      return;
    }

    next(error);
  }
};

/**
 * Optional authentication middleware
 * Attaches user if token exists, but doesn't fail if not
 */
export const optionalAuth = (req: Request, _res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next();
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, env.jwt.secret) as AuthenticatedJwtPayload;

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch {
    // Token invalid, but we don't fail - just continue without user
    next();
  }
};

/**
 * Authorization middleware factory
 * Restricts access to specific roles
 * @param roles - Allowed roles
 */
export const authorize = (...roles: Array<"admin" | "customer">) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(HttpError.unauthorized("Authentication required"));
      return;
    }

    if (!roles.includes(req.user.role)) {
      next(HttpError.forbidden("You do not have permission to access this resource"));
      return;
    }

    next();
  };
};

/**
 * Admin only middleware
 * Shorthand for authorize("admin")
 */
export const adminOnly = authorize("admin");
