import mongoose from "mongoose";
import { env } from "./env.js";

const connectDatabase = async () => {
  // Already connected
  if (mongoose.connection.readyState === 1) {
    return;
  }

  // Connection already in progress
  if (mongoose.connection.readyState === 2) {
    await mongoose.connection.asPromise();
    return;
  }

  await mongoose.connect(env.MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 20000,
    waitQueueTimeoutMS: 10000,
    heartbeatFrequencyMS: 10000,

   maxPoolSize:
    env.NODE_ENV === "test"
    ? 5
    : Number(env.MONGO_MAX_POOL_SIZE || 20),

   minPoolSize:
    env.NODE_ENV === "test"
    ? 0
    : Number(env.MONGO_MIN_POOL_SIZE || 2),

    maxIdleTimeMS: 30000,

    

    retryWrites: true,

    
  });

  console.log("====================================");
  console.log("✅ MongoDB Connected Successfully");
  console.log(`Database : ${mongoose.connection.name}`);
  console.log(`Host     : ${mongoose.connection.host}`);
  console.log("====================================");
};

export default connectDatabase;