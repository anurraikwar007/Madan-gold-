import app from "./app.js";

import { env } from "./config/env.js";
import connectDB from "./config/database.js";

const startServer = async () => {
  try {
    await connectDB();

    app.listen(env.PORT, () => {
      console.log("==================================");
      console.log(`🚀 Server Running on Port ${env.PORT}`);
      console.log(`🌍 Environment : ${env.NODE_ENV}`);
      console.log(`📡 API : /api/v1`);      
      console.log("==================================");
    });
  } catch (error) {
    console.error("❌ Server Failed To Start");
    console.error(error.message);
    process.exit(1);
  }
};

startServer();