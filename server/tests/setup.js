import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDatabase from "../src/config/database.js";

dotenv.config({
  path: ".env.test",
});

beforeAll(async () => {
  console.log("========== TEST START ==========");

  if (mongoose.connection.readyState === 0) {
    await connectDatabase();
  }
}, 30000);

afterAll(async () => {
  await mongoose.connection.close();

  console.log("========== TEST END ==========");
}, 30000);