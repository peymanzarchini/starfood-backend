import { NextFunction, Request, Response } from "express";

/**
 * Response middleware - Adds success and fail methods to response object
 * This provides a consistent API response format throughout the application
 */
export function responseMiddleware(_req: Request, res: Response, next: NextFunction): void {
  /**
   * Send a success response
   * @param message - Success message
   * @param body - Response data
   * @param status - HTTP status code (default: 200)
   */
  res.success = function <T>(message: string, body: T, status: number = 200): Response {
    return res.status(status).json({
      success: true,
      message,
      body,
      status,
    });
  };

  /**
   * Send a failure response
   * @param message - Error message
   * @param body - Additional error data
   * @param status - HTTP status code (default: 400)
   */
  res.fail = function <T>(message: string, body?: T, status: number = 400): Response {
    return res.status(status).json({
      success: false,
      message,
      body: body || null,
      status,
    });
  };

  next();
}
