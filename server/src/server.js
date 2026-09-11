import app from "./app.js";
import { env } from "./config/env.js";
import connectDB from "./config/database.js";
import mongoose from "mongoose";

let server;

const startServer = async () => {
  try {
    await connectDB();

    server = app.listen(env.PORT, () => {
      console.log("==================================");
      console.log(`🚀 Server Running on Port ${env.PORT}`);
      console.log(`🌍 Environment : ${env.NODE_ENV}`);
      console.log(`📡 API : /api/v1`);
      console.log("==================================");
    });

    const shutdown = async (signal) => {
      console.log(`\n${signal} received. Shutting down gracefully...`);
      if (server) {
        await new Promise((resolve) => server.close(resolve));
      }
      if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.close(false);
      }
      process.exit(0);
    };

    process.once("SIGTERM", () => shutdown("SIGTERM"));
    process.once("SIGINT", () => shutdown("SIGINT"));
  } catch (error) {
    console.error("❌ Server Failed To Start");
    console.error(error);
    process.exit(1);
  }
};

startServer();
