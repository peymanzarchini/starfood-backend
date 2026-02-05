import { Response, CookieOptions } from "express";
import { env } from "../config/env.js";

export const COOKIE_NAMES = {
  REFRESH_TOKEN: "refresh_token",
  ACCESS_TOKEN: "access_token",
} as const;

function parseExpiresInMs(time: string): number {
  const match = time.match(/^(\d+)([smhd])$/);
  if (!match) return 7 * 24 * 60 * 60 * 1000;

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case "s":
      return value * 1000;
    case "m":
      return value * 60 * 1000;
    case "h":
      return value * 60 * 60 * 1000;
    case "d":
      return value * 24 * 60 * 60 * 1000;
    default:
      return 7 * 24 * 60 * 60 * 1000;
  }
}

function getAccessTokenCookieOptions(): CookieOptions {
  const maxAge = parseExpiresInMs(env.jwt.expiresIn);

  return {
    httpOnly: true,
    secure: env.cookie.secure,
    sameSite: env.cookie.sameSite,
    maxAge,
    path: "/",
    ...(env.cookie.domain && { domain: env.cookie.domain }),
  };
}

export function setAccessTokenCookie(res: Response, accessToken: string): void {
  res.cookie(COOKIE_NAMES.ACCESS_TOKEN, accessToken, getAccessTokenCookieOptions());
}

export function clearAccessTokenCookie(res: Response): void {
  res.clearCookie(COOKIE_NAMES.ACCESS_TOKEN, {
    httpOnly: true,
    secure: env.cookie.secure,
    sameSite: env.cookie.sameSite,
    path: "/",
    ...(env.cookie.domain && { domain: env.cookie.domain }),
  });
}

function getRefreshTokenCookieOptions(): CookieOptions {
  const maxAge = parseExpiresInMs(env.jwt.refreshExpiresIn);

  return {
    httpOnly: true,
    secure: env.cookie.secure,
    sameSite: env.cookie.sameSite,
    maxAge,
    path: "/",
    ...(env.cookie.domain && { domain: env.cookie.domain }),
  };
}

export function setRefreshTokenCookie(res: Response, refreshToken: string): void {
  res.cookie(COOKIE_NAMES.REFRESH_TOKEN, refreshToken, getRefreshTokenCookieOptions());
}

export function clearRefreshTokenCookie(res: Response): void {
  res.clearCookie(COOKIE_NAMES.REFRESH_TOKEN, {
    httpOnly: true,
    secure: env.cookie.secure,
    sameSite: env.cookie.sameSite,
    path: "/",
    ...(env.cookie.domain && { domain: env.cookie.domain }),
  });
}
