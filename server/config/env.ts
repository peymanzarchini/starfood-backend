import "dotenv/config";

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "3000", 10),

  db: {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306", 10),
    name: process.env.DB_NAME || "fastfood_db",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
  },

  jwt: {
    secret: process.env.JWT_SECRET || "default_secret",
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    refreshSecret: process.env.REFRESH_SECRET || "default_refresh_secret",
    refreshExpiresIn: process.env.REFRESH_EXPIRES_IN || "7d",
  },

  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",

  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || "5242880", 10),
    path: process.env.UPLOAD_PATH || "uploads",
  },

  isDev: process.env.NODE_ENV === "development",
  isProd: process.env.NODE_ENV === "production",
} as const;
