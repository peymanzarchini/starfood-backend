import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";
import { AuthenticatedUser } from "../types/express.js";

/**
 * Token pair interface
 */
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

/**
 * JWT payload for tokens
 */
interface JwtPayload {
  id: number;
  email: string;
  role: "admin" | "customer";
}

/**
 * Parse expiration time to seconds
 * @param time - Time string like "1h", "7d", "30m"
 * @returns Number of seconds
 */
function parseExpiresIn(time: string): number {
  const match = time.match(/^(\d+)([smhd])$/);

  if (!match) {
    return 3600; // Default: 1 hour
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case "s":
      return value;
    case "m":
      return value * 60;
    case "h":
      return value * 60 * 60;
    case "d":
      return value * 60 * 60 * 24;
    default:
      return 3600;
  }
}

/**
 * Generate access token
 * @param user - User data to encode
 */
export function generateAccessToken(user: AuthenticatedUser): string {
  const payload: JwtPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const options: SignOptions = {
    expiresIn: parseExpiresIn(env.jwt.expiresIn),
  };

  return jwt.sign(payload, env.jwt.secret, options);
}

/**
 * Generate refresh token
 * @param user - User data to encode
 */
export function generateRefreshToken(user: AuthenticatedUser): string {
  const payload: JwtPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const options: SignOptions = {
    expiresIn: parseExpiresIn(env.jwt.refreshExpiresIn),
  };

  return jwt.sign(payload, env.jwt.refreshSecret, options);
}

/**
 * Generate both access and refresh tokens
 * @param user - User data to encode
 */
export function generateTokens(user: AuthenticatedUser): TokenPair {
  return {
    accessToken: generateAccessToken(user),
    refreshToken: generateRefreshToken(user),
  };
}

/**
 * Verify access token
 * @param token - JWT token to verify
 */
export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, env.jwt.secret) as JwtPayload;
}

/**
 * Verify refresh token
 * @param token - Refresh token to verify
 */
export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, env.jwt.refreshSecret) as JwtPayload;
}
