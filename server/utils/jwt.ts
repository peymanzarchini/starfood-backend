import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";
import { AuthenticatedUser } from "../types/express.js";

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

interface JwtPayload {
  id: number;
  email: string;
  role: "admin" | "customer";
}

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

export function generateTokens(user: AuthenticatedUser): TokenPair {
  return {
    accessToken: generateAccessToken(user),
    refreshToken: generateRefreshToken(user),
  };
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, env.jwt.secret) as JwtPayload;
}

export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, env.jwt.refreshSecret) as JwtPayload;
}
