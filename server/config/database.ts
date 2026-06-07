import { Sequelize } from "@sequelize/core";
import { MySqlDialect } from "@sequelize/mysql";
import { env } from "./env.js";
import { logger } from "./logger.js";

export const sequelize = new Sequelize({
  dialect: MySqlDialect,
  host: env.db.host,
  port: env.db.port,
  database: env.db.name,
  user: env.db.user,
  password: env.db.password,
  logging: false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    underscored: false,
    freezeTableName: true,
  },
});

export async function connectDB(): Promise<void> {
  try {
    await sequelize.authenticate();
    logger.info("✅ Database connection established successfully");

    if (env.isDev) {
      await sequelize.sync({ alter: true });
      logger.info("🔄 Database synchronized (development mode)");
    }
  } catch (error) {
    logger.error("❌ Unable to connect to database:", error);
    process.exit(1);
  }
}

export async function closeDB(): Promise<void> {
  try {
    await sequelize.close();
    logger.info("Database connection closed");
  } catch (error) {
    logger.error("Error closing database connection:", error);
  }
}
