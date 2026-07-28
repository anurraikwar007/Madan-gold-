import dotenv from "dotenv";
import mongoose from "mongoose";

import Admin from "../models/admin.model.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const exists = await Admin.findOne({
      email: process.env.ADMIN_EMAIL,
    });

    if (exists) {
      console.log("✅ Admin already exists");
      process.exit(0);
    }

    await Admin.create({
      name: "Super Admin",
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: "SuperAdmin", // agar model me Admin hai to "Admin" kar do
      isActive: true,
    });

    console.log("✅ Admin Created Successfully");

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedAdmin();