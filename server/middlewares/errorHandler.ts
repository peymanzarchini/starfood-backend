/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from "express";
import {
  ValidationError,
  UniqueConstraintError,
  ForeignKeyConstraintError,
  DatabaseError,
} from "@sequelize/core";
import { HttpError } from "../utils/httpError.js";
import { logger } from "../config/logger.js";

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction): void {
  logger.error("Error caught by handler:", err);

  let statusCode = 500;
  let message = "Internal Server Error";

  if (err instanceof ValidationError) {
    statusCode = 400;
    message = err.errors.map((e) => e.message).join(" | ");
  } else if (err instanceof UniqueConstraintError) {
    statusCode = 409;
    message = err.errors.map((e) => e.message).join(" | ");
  } else if (err instanceof ForeignKeyConstraintError) {
    statusCode = 400;
    message = "The reference ID is invalid or does not exist.";
  } else if (err instanceof DatabaseError) {
    statusCode = 503;
    message = "The database service is unavailable. Please try again later.";
  } else if (err instanceof HttpError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (typeof err === "object" && err !== null && "statusCode" in err) {
    const expressErr = err as { statusCode?: number; message?: string };
    statusCode = expressErr.statusCode || 500;
    message = expressErr.message || "Internal Server Error";

    if (message.includes("JSON")) {
      message = "Invalid JSON format in request body";
      statusCode = 400;
    }
  }

  if (typeof res.fail === "function") {
    res.fail(message, null, statusCode);
  } else {
    res.status(statusCode).json({
      success: false,
      message,
      body: null,
      status: statusCode,
    });
  }
}
