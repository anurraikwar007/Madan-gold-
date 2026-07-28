import asyncHandler from "../utils/asyncHandler.js";

export const healthCheck = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running successfully 🚀",
    timestamp: new Date(),
  });
});