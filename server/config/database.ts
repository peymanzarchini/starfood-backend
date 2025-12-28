import { Sequelize } from "@sequelize/core";
import { MySqlDialect } from "@sequelize/mysql";
import { env } from "./env.js";
import { logger } from "./logger.js";

/**
 * Sequelize database instance configuration
 */
export const sequelize = new Sequelize({
  dialect: MySqlDialect,
  host: env.db.host,
  port: env.db.port,
  database: env.db.name,
  user: env.db.user,
  password: env.db.password,
  logging: env.isDev ? (msg) => logger.debug(msg) : false,
  pool: {
    max: 10, // Maximum number of connections in pool
    min: 0, // Minimum number of connections in pool
    acquire: 30000, // Maximum time (ms) to acquire connection
    idle: 10000, // Maximum time (ms) connection can be idle
  },
  define: {
    underscored: false, // Use camelCase for auto-generated fields
    freezeTableName: true, // Prevent Sequelize from pluralizing table names
  },
});

/**
 * Connect to database and sync models
 * @throws Error if connection fails
 */
export async function connectDB(): Promise<void> {
  try {
    // Test connection
    await sequelize.authenticate();
    logger.info("✅ Database connection established successfully");

    // Sync models in development
    if (env.isDev) {
      await sequelize.sync({ alter: true });
      logger.info("🔄 Database synchronized (development mode)");
    }
  } catch (error) {
    logger.error("❌ Unable to connect to database:", error);
    process.exit(1);
  }
}

/**
 * Close database connection gracefully
 */
export async function closeDB(): Promise<void> {
  try {
    await sequelize.close();
    logger.info("Database connection closed");
  } catch (error) {
    logger.error("Error closing database connection:", error);
  }
}
