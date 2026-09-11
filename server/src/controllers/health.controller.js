import asyncHandler from "../utils/asyncHandler.js";
import mongoose from "mongoose";

export const healthCheck = asyncHandler(async (req, res) => {
  const dbReady = mongoose.connection.readyState === 1;
  res.status(dbReady ? 200 : 503).json({
    success: dbReady,
    status: dbReady ? "ok" : "degraded",
    service: "madan-gold-api",
    database: dbReady ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});
