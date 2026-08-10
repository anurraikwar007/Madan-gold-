import { jest } from "@jest/globals";

import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDatabase from "../src/config/database.js";

dotenv.config({
   path: "./tests/.env.test",
});

// ==========================================
// Global Jest Timeout
// ==========================================

jest.setTimeout(30000);

// ==========================================
// Test Start
// ==========================================

beforeAll(async () => {
  console.log("========== TEST START ==========");

  await connectDatabase();
}, 30000);

// ==========================================
// Test End
// ==========================================

afterAll(async () => {
  console.log("========== TEST END ==========");

  if (
    mongoose.connection.readyState !== 0
  ) {
    await mongoose.connection.close();
  }
}, 30000);