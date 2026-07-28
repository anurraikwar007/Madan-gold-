import mongoose from "mongoose";
import { env } from "./env.js";

const connectDatabase = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI);

    console.log("====================================");
    console.log("✅ MongoDB Connected Successfully");
    console.log(`Database : ${mongoose.connection.name}`);
    console.log(`Host     : ${mongoose.connection.host}`);
    console.log("====================================");
  } catch (error) {
    console.error("====================================");
    console.error("❌ MongoDB Connection Failed");
    console.error(error.message);
    console.error("====================================");

    process.exit(1);
  }
};

export default connectDatabase;