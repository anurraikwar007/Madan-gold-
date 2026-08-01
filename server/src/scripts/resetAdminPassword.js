import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import Admin from "../models/admin.model.js";

dotenv.config();

await mongoose.connect(process.env.MONGODB_URI);

const hash = await bcrypt.hash("12345678",10);

await Admin.updateOne(
    { email: "admin@madangold.com" },
    { password: "12345678" }
);

console.log("Password Reset Done");

process.exit();