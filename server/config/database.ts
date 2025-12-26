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
  logging: env.isDev ? (msg) => logger.debug(msg) : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    logger.info("✅ Database connection established successfully.");

    if (env.isDev) {
      await sequelize.sync({ alter: true });
      logger.info("🔄 Database synchronized successfully in development mode.");
    }
  } catch (error) {
    logger.error("❌ Unable to connect to the database:", error);
    process.exit(1);
  }
};
