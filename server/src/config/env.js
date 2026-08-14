import dotenv from "dotenv";

dotenv.config();

const requiredEnv = [
  "PORT",
  "MONGODB_URI",
  "JWT_SECRET",
  "JWT_EXPIRES_IN",
  "CLIENT_URL",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "ADMIN_EMAIL",
  "ADMIN_PASSWORD",
];

if (process.env.NODE_ENV !== "test") {
  requiredEnv.push(
    "RESEND_API_KEY",
    "RESEND_FROM_EMAIL"
  );
}

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(
      `Missing Environment Variable: ${key}`
    );
  }
});

export const env = {
  NODE_ENV:
    process.env.NODE_ENV || "development",

  PORT:
    Number(process.env.PORT) || 5000,

  MONGODB_URI:
    process.env.MONGODB_URI,

  JWT_SECRET:
    process.env.JWT_SECRET,

  JWT_EXPIRES_IN:
    process.env.JWT_EXPIRES_IN,

  CLIENT_URL:
    process.env.CLIENT_URL,

  CLOUDINARY_CLOUD_NAME:
    process.env.CLOUDINARY_CLOUD_NAME,

  CLOUDINARY_API_KEY:
    process.env.CLOUDINARY_API_KEY,

  CLOUDINARY_API_SECRET:
    process.env.CLOUDINARY_API_SECRET,

  RESEND_API_KEY:
    process.env.RESEND_API_KEY,

  RESEND_FROM_EMAIL:
    process.env.RESEND_FROM_EMAIL,

  ADMIN_EMAIL:
    process.env.ADMIN_EMAIL,

  ADMIN_PASSWORD:
    process.env.ADMIN_PASSWORD,

  /*
  =========================================================
  Refresh Token
  =========================================================
  */

  REFRESH_TOKEN_DAYS:
    Number(process.env.REFRESH_TOKEN_DAYS) || 30,

  REFRESH_COOKIE_NAME:
    process.env.REFRESH_COOKIE_NAME ||
    "madangold_refresh_token",

  REFRESH_COOKIE_SECURE:
    process.env.NODE_ENV === "production",
};