import dotenv from "dotenv";
import path from "path";

// Load environment file based on NODE_ENV. If NODE_ENV is not set,
// default to `.env.development`. The previous code used separate
// path segments (".env.", NODE_ENV) which produced a path like
// `./.env./development` (a directory + file) instead of a single
// filename like `./.env.development`.
const envFileName = `.env.${process.env.NODE_ENV || "development"}`;
dotenv.config({
  path: path.resolve(process.cwd(), envFileName),
});

import { z } from "zod";  `q  `

// 🧩 Define schema for environment variables
const envSchema = z.object({
  // Server
  PORT: z.string().default("3000"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  // Database
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  // JWT
  ACCESS_TOKEN_SECRET: z.string().min(1, "ACCESS_TOKEN_SECRET is required"),
  ACCESS_TOKEN_EXPIRES_IN: z.string().default("15m"),

  REFRESH_TOKEN_SECRET: z.string().min(1, "REFRESH_TOKEN_SECRET is required"),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default("7d"),

  // Cookie
  COOKIE_EXPIRES_IN: z.string().default("1d"),

  // CORS
  CORS_ORIGINS: z
    .string()
    .default("*")
    .transform((val: string) => val.split(",").map((origin) => origin.trim())),

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: z.string().min(1, "CLOUDINARY_CLOUD_NAME is required"),
  CLOUDINARY_API_KEY: z.string().min(1, "CLOUDINARY_API_KEY is required"),
  CLOUDINARY_API_SECRET: z.string().min(1, "CLOUDINARY_API_SECRET is required"),

  // Frontend URL
  FRONTEND_URL: z.string().url("FRONTEND_URL must be a valid URL"),

  // PASSWORD HASH SALT ROUNDS :
  PASSWORD_SALT_ROUNDS: z
    .string()
    .default("10")
    .transform((val) => parseInt(val, 10)),

  // SUPER_ADMIN_PASSWORD
  SUPER_ADMIN_PASSWORD: z
    .string({
      error: "Super admin password is required!",
    })
    .transform((val) => val?.trim()),
});

// 🧩 Parse and validate environment variables
const envVariables = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,

  // DATABASE URL:
  DATABASE_URL: process.env.DATABASE_URL,

  // JWT SECRET KEY:
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN,

  // REFRESH TOKEN:
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN,

  // COOKIE:
  COOKIE_EXPIRES_IN: process.env.COOKIE_EXPIRES_IN,

  // CORS ORIGINS:
  CORS_ORIGINS: process.env.CORS_ORIGINS,

  // CLOUDINARY:
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

  // FRONTEND URL :
  FRONTEND_URL: process.env.FRONTEND_URL,

  // PASSWORD HASH SALT ROUNDS :
  PASSWORD_SALT_ROUNDS: process.env.PASSWORD_SALT_ROUNDS,

  // SUPER_ADMIN_PASSWORD:
  SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD,
};

type TEnv = z.infer<typeof envSchema>;

const validateEnv = (env: unknown): TEnv => {
  const result = envSchema.safeParse(env);
  if (!result.success) {
    // Print a nicely formatted error and fail fast so the app doesn't
    // start with missing/invalid config.
    console.error("❌ Invalid environment variables:", result.error.format());
    // Exit the process to avoid running with an invalid configuration.
    // This is intentional so misconfiguration is noticed immediately.
    process.exit(1);
  }
  return result.data;
};

export const env = validateEnv(envVariables);
