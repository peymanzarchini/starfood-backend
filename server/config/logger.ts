import winston from "winston";
import path from "path";
import { env } from "./env.js";

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
  })
);

const transports: winston.transport[] = [
  new winston.transports.Console({
    format: winston.format.combine(winston.format.colorize(), logFormat),
  }),
];

if (env.isProd) {
  transports.push(
    new winston.transports.File({
      filename: path.join(process.cwd(), "logs", "error.log"),
      level: "error",
    }),
    new winston.transports.File({
      filename: path.join(process.cwd(), "logs", "combined.log"),
    })
  );
}

export const logger = winston.createLogger({
  level: env.isDev ? "debug" : "info",
  format: logFormat,
  transports,
});
