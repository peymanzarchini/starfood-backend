import winston from "winston";
import path from "path";
import { env } from "./env.js";

/**
 * Custom log format
 */
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ level, message, timestamp, stack, ...meta }) => {
    let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;

    // Add stack trace for errors
    if (stack) {
      log += `\n${stack}`;
    }

    // Add metadata if present
    if (Object.keys(meta).length > 0) {
      log += ` ${JSON.stringify(meta)}`;
    }

    return log;
  })
);

/**
 * Console format with colors
 */
const consoleFormat = winston.format.combine(winston.format.colorize({ all: true }), logFormat);

/**
 * Configure transports based on environment
 */
const transports: winston.transport[] = [
  // Always log to console
  new winston.transports.Console({
    format: consoleFormat,
  }),
];

// Add file transports in production
if (env.isProd) {
  const logsDir = path.join(process.cwd(), "logs");

  transports.push(
    // Error logs
    new winston.transports.File({
      filename: path.join(logsDir, "error.log"),
      level: "error",
      maxsize: 5 * 1024 * 1024, // 5MB
      maxFiles: 5,
    }),
    // Combined logs
    new winston.transports.File({
      filename: path.join(logsDir, "combined.log"),
      maxsize: 5 * 1024 * 1024, // 5MB
      maxFiles: 5,
    })
  );
}

/**
 * Winston logger instance
 */
export const logger = winston.createLogger({
  level: env.isDev ? "debug" : "info",
  format: logFormat,
  transports,
  // Don't exit on uncaught exceptions
  exitOnError: false,
});

/**
 * Stream for Morgan HTTP logging
 */
export const morganStream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};
