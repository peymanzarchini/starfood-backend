import "dotenv/config";

function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;

  if (!value && process.env.NODE_ENV === "production") {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value || "";
}

function getEnvInt(key: string, defaultValue: number): number {
  const value = process.env[key];
  if (!value) return defaultValue;

  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    throw new Error(`Environment variable ${key} must be a valid integer`);
  }

  return parsed;
}

export const env = {
  nodeEnv: getEnvVar("NODE_ENV", "development"),
  port: getEnvInt("PORT", 3000),

  db: {
    host: getEnvVar("DB_HOST", "localhost"),
    port: getEnvInt("DB_PORT", 3306),
    name: getEnvVar("DB_NAME", "starfood_db"),
    user: getEnvVar("DB_USER", "root"),
    password: getEnvVar("DB_PASS"),
  },

  jwt: {
    secret: getEnvVar("JWT_SECRET"),
    expiresIn: getEnvVar("JWT_EXPIRES_IN", "1h"),
    refreshSecret: getEnvVar("JWT_REFRESH_SECRET"),
    refreshExpiresIn: getEnvVar("JWT_REFRESH_EXPIRES_IN", "7d"),
  },

  cookie: {
    secret: getEnvVar("COOKIE_SECRET"),
    secure: process.env.NODE_ENV === "production",
    sameSite: (process.env.COOKIE_SAME_SITE as "strict" | "lax" | "none") || "lax",
    domain: getEnvVar("COOKIE_DOMAIN", ""),
  },

  clientUrl: getEnvVar("CLIENT_URL", "http://localhost:5173"),

  upload: {
    maxFileSize: getEnvInt("MAX_FILE_SIZE", 5 * 1024 * 1024), // 5MB
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
    path: getEnvVar("UPLOAD_PATH", "uploads"),
  },

  rateLimit: {
    windowMs: getEnvInt("RATE_LIMIT_WINDOW_MS", 15 * 60 * 1000), // 15 minutes
    maxRequests: getEnvInt("RATE_LIMIT_MAX_REQUESTS", 100),
  },

  isDev: process.env.NODE_ENV === "development",
  isProd: process.env.NODE_ENV === "production",
  isTest: process.env.NODE_ENV === "test",
} as const;

export function validateEnv(): void {
  if (env.isProd) {
    const requiredVars = ["JWT_SECRET", "JWT_REFRESH_SECRET", "DB_HOST", "DB_NAME", "DB_USER"];

    const missing = requiredVars.filter((key) => !process.env[key]);

    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables in production: ${missing.join(", ")}`,
      );
    }

    if (env.jwt.secret.includes("default")) {
      console.warn("⚠️ WARNING: Using default JWT secret in production!");
    }
  }
}
