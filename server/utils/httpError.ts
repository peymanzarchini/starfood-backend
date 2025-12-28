/**
 * Custom HTTP Error class
 * Extends Error with HTTP status code support
 */
export class HttpError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Distinguishes operational errors from programming errors

    // Maintain proper stack trace
    Error.captureStackTrace(this, this.constructor);

    // Set prototype explicitly for instanceof checks
    Object.setPrototypeOf(this, HttpError.prototype);
  }

  /**
   * 400 Bad Request
   */
  static badRequest(message: string = "Bad request"): HttpError {
    return new HttpError(message, 400);
  }

  /**
   * 401 Unauthorized
   */
  static unauthorized(message: string = "Unauthorized"): HttpError {
    return new HttpError(message, 401);
  }

  /**
   * 403 Forbidden
   */
  static forbidden(message: string = "Forbidden"): HttpError {
    return new HttpError(message, 403);
  }

  /**
   * 404 Not Found
   */
  static notFound(message: string = "Resource not found"): HttpError {
    return new HttpError(message, 404);
  }

  /**
   * 409 Conflict
   */
  static conflict(message: string = "Resource already exists"): HttpError {
    return new HttpError(message, 409);
  }

  /**
   * 422 Unprocessable Entity
   */
  static unprocessable(message: string = "Unprocessable entity"): HttpError {
    return new HttpError(message, 422);
  }

  /**
   * 429 Too Many Requests
   */
  static tooManyRequests(message: string = "Too many requests"): HttpError {
    return new HttpError(message, 429);
  }

  /**
   * 500 Internal Server Error
   */
  static internal(message: string = "Internal server error"): HttpError {
    return new HttpError(message, 500);
  }

  /**
   * 503 Service Unavailable
   */
  static serviceUnavailable(message: string = "Service unavailable"): HttpError {
    return new HttpError(message, 503);
  }
}
