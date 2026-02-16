import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, //15 minutes
  max: 5, // 5 requests per window
  message: {
    success: false,
    message: "Too many login attempts. Please try again in 15 minutes.",
    status: 429,
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Use IP + email as key to prevent one IP from blocking another user
  keyGenerator: (req) => {
    const email = req.body?.email || "";
    return `${req.ip}-${email}`;
  },
  skipSuccessfulRequests: true, // Don't count successful logins
});

/**
 * Stricter limiter for password-related endpoints
 */
export const passwordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 requests per hour
  message: {
    success: false,
    message: "Too many password change attempts. Please try again in 1 hour.",
    status: 429,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Limiter for registration
 */
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 registrations per hour per IP
  message: {
    success: false,
    message: "Too many registration attempts from this IP. Please try again in 1 hour.",
    status: 429,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Limiter for refresh token endpoint
 */
export const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests per window
  message: {
    success: false,
    message: "Too many token refresh requests. Please try again later.",
    status: 429,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Limiter for discount validation
 * Prevents discount code enumeration
 */
export const discountValidationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per window
  message: {
    success: false,
    message: "Too many discount validation attempts. Please try again later.",
    status: 429,
  },
  standardHeaders: true,
  legacyHeaders: false,
});
