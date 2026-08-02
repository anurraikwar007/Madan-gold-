import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDatabase from "../src/config/database.js";

dotenv.config();

beforeAll(async () => {

    console.log("========== TEST START ==========");

    await connectDatabase();

}, 30000);

afterAll(async () => {

    await mongoose.connection.close();

    console.log("========== TEST END ==========");

}, 30000);