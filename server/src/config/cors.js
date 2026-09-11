import cors from "cors";
import { env } from "./env.js";

// Keep CORS explicit, but allow local development against the deployed API.
// Additional production origins can be supplied through CORS_ORIGINS as a
// comma-separated list in Render/Vercel environments.
const configuredOrigins = String(process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const whitelist = new Set([
  env.CLIENT_URL,
  "https://www.madangold.com",
  "https://madangold.com",
  ...configuredOrigins,
  // Local development is intentionally allowed even when NODE_ENV=production
  // because the deployed Render API is commonly tested from Vite locally.
  "http://localhost:5173",
  "http://127.0.0.1:5173",
]);

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (whitelist.has(origin)) return true;

  // Vite commonly moves between 5173/5174/5175 when another process is open.
  try {
    const url = new URL(origin);
    if (
      (url.hostname === "localhost" || url.hostname === "127.0.0.1") &&
      /^\d+$/.test(url.port)
    ) {
      return true;
    }
  } catch {
    return false;
  }

  return false;
};

const corsOptions = {
  origin(origin, callback) {
    if (isAllowedOrigin(origin)) {
      return callback(null, true);
    }

    return callback(new Error("CORS Not Allowed"));
  },

  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept", "X-Requested-With"],
  exposedHeaders: ["Content-Length"],
  optionsSuccessStatus: 204,
};

export default cors(corsOptions);
