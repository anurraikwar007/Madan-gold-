import asyncHandler from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { generateToken } from "../utils/jwt.js";

import {
  findAdminByEmail,
  updateLastLogin,
} from "../services/auth.service.js";

// =========================
// Admin Login
// =========================

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await findAdminByEmail(email);

  if (!admin) {
    return res
      .status(401)
      .json(apiResponse.error("Invalid email or password"));
  }

  const isMatch = await admin.comparePassword(password);

  if (!isMatch) {
    return res
      .status(401)
      .json(apiResponse.error("Invalid email or password"));
  }

  await updateLastLogin(admin._id);

  const token = generateToken({
    id: admin._id,
    role: admin.role,
  });

  admin.password = undefined;

  return res.status(200).json(
    apiResponse.success("Login successful", {
      token,
      admin,
    })
  );
});

// =========================
// Admin Profile
// =========================

export const me = asyncHandler(async (req, res) => {
  return res.status(200).json(
    apiResponse.success(
      "Admin profile fetched successfully",
      req.admin
    )
  );
});