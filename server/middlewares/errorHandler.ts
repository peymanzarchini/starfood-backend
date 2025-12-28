import { Request, Response } from "express";
import {
  ValidationError,
  UniqueConstraintError,
  ForeignKeyConstraintError,
  DatabaseError,
} from "@sequelize/core";
import { HttpError } from "../utils/httpError.js";
import { logger } from "../config/logger.js";

/**
 * Global error handler middleware
 * Handles different types of errors and sends appropriate responses
 */

export function errorHandler(err: unknown, req: Request, res: Response): void {
  // Log error for debugging
  logger.error("Error caught by handler:", err);

  // Default error values
  let statusCode = 500;
  let message = "Internal Server Error";

  // Handle Sequelize validation errors
  if (err instanceof ValidationError) {
    statusCode = 400;
    message = err.errors.map((e) => e.message).join(" | ");
    res.fail(message, null, statusCode);
    return;
  }

  // Handle Unique Constraint Error (e.g., duplicate email)
  if (err instanceof UniqueConstraintError) {
    statusCode = 409;
    message = err.errors.map((e) => e.message).join(" | ");
    res.fail(message, null, statusCode);
    return;
  }

  // Handle Foreign Key Constraint Error
  if (err instanceof ForeignKeyConstraintError) {
    statusCode = 400;
    message = "The reference ID is invalid or does not exist.";
    res.fail(message, null, statusCode);
    return;
  }

  // Handle Database Connection Error
  if (err instanceof DatabaseError) {
    statusCode = 503;
    message = "The database service is unavailable. Please try again later.";
    res.fail(message, null, statusCode);
    return;
  }

  // Handle Custom HTTP Error
  if (err instanceof HttpError) {
    res.fail(err.message, null, err.statusCode);
    return;
  }

  res.fail(message, null, statusCode);
}
