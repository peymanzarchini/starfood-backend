export class HttpError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);

    Object.setPrototypeOf(this, HttpError.prototype);
  }

  static badRequest(message: string = "Bad request"): HttpError {
    return new HttpError(message, 400);
  }

  static unauthorized(message: string = "Unauthorized"): HttpError {
    return new HttpError(message, 401);
  }

  static forbidden(message: string = "Forbidden"): HttpError {
    return new HttpError(message, 403);
  }

  static notFound(message: string = "Resource not found"): HttpError {
    return new HttpError(message, 404);
  }

  static conflict(message: string = "Resource already exists"): HttpError {
    return new HttpError(message, 409);
  }

  static unprocessable(message: string = "Unprocessable entity"): HttpError {
    return new HttpError(message, 422);
  }

  static tooManyRequests(message: string = "Too many requests"): HttpError {
    return new HttpError(message, 429);
  }

  static internal(message: string = "Internal server error"): HttpError {
    return new HttpError(message, 500);
  }

  static serviceUnavailable(message: string = "Service unavailable"): HttpError {
    return new HttpError(message, 503);
  }
}
