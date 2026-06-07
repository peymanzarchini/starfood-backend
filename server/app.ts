import express, { Application } from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import rateLimit from "express-rate-limit";

import { env, validateEnv } from "./config/env.js";
import { closeDB, connectDB } from "./config/database.js";
import { logger, morganStream } from "./config/logger.js";
import { responseMiddleware } from "./middlewares/response.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { routes } from "./routes/index.js";
import swaggerUi from "swagger-ui-express";
import { runSeeders } from "./utils/settings.seeder.js";
import { swaggerSpec } from "./config/swagger/index.js";

const app: Application = express();

validateEnv();

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(
  morgan(env.isDev ? "dev" : "combined", {
    stream: morganStream,
    skip: () => env.isTest,
  }),
);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

app.use("/uploads", express.static(path.join(process.cwd(), env.upload.path)));

app.use(responseMiddleware);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const limiter = rateLimit({
  windowMs: env.rateLimit.windowMs,
  max: env.rateLimit.maxRequests,
  message: {
    success: false,
    message: "Too many requests, please try again later",
    status: 429,
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", limiter);

app.get("/health", (_req, res) => {
  res.success("Server is healthy", {
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use("/api", routes);

app.use((_req, res) => {
  res.fail("Route not found", null, 404);
});

app.use(errorHandler);

const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    if (env.isDev) {
      await runSeeders();
    }
    app.listen(env.port, () => {
      logger.info(`🚀 Server running on port ${env.port}`);
      logger.info(`📍 Environment: ${env.nodeEnv}`);
      logger.info(`🔗 API URL: http://localhost:${env.port}/api`);
      logger.info(`📚 Swagger Docs: http://localhost:${env.port}/api-docs`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

process.on("SIGTERM", async () => {
  logger.info("SIGTERM received. Shutting down gracefully...");
  await closeDB();
  process.exit(0);
});

process.on("SIGINT", async () => {
  logger.info("SIGINT received. Shutting down gracefully...");
  await closeDB();
  process.exit(0);
});

startServer();

export { app };
