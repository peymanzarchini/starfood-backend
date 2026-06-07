import winston from "winston";
import path from "path";
import { env } from "./env.js";

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ level, message, timestamp, stack, ...meta }) => {
    let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;

    if (stack) {
      log += `\n${stack}`;
    }

    if (Object.keys(meta).length > 0) {
      log += ` ${JSON.stringify(meta)}`;
    }

    return log;
  }),
);

const consoleFormat = winston.format.combine(winston.format.colorize({ all: true }), logFormat);

const transports: winston.transport[] = [
  new winston.transports.Console({
    format: consoleFormat,
  }),
];

if (env.isProd) {
  const logsDir = path.join(process.cwd(), "logs");

  transports.push(
    new winston.transports.File({
      filename: path.join(logsDir, "error.log"),
      level: "error",
      maxsize: 5 * 1024 * 1024, // 5MB
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: path.join(logsDir, "combined.log"),
      maxsize: 5 * 1024 * 1024, // 5MB
      maxFiles: 5,
    }),
  );
}

export const logger = winston.createLogger({
  level: env.isDev ? "debug" : "info",
  format: logFormat,
  transports,
  exitOnError: false,
});

export const morganStream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};
