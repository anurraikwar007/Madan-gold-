import asyncHandler from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";

import {
  registerCustomer,
  loginCustomer,
  findAdminByEmail,
  updateLastLogin,
} from "../services/auth.service.js";

import { generateToken } from "../utils/jwt.js";

class AuthController {
  register = asyncHandler(async (req, res) => {
    const customer = await registerCustomer(req.body);

    return res.status(201).json(
      apiResponse.success(
        "Customer registered successfully.",
        customer
      )
    );
  });

  customerLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const result = await loginCustomer(email, password);

    return res.status(200).json(
      apiResponse.success(
        "Login successful.",
        result
      )
    );
  });

  adminLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const admin = await findAdminByEmail(email);

    if (!admin) {
      throw new Error("Invalid email or password");
    }

    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      throw new Error("Invalid email or password");
    }

    await updateLastLogin(admin._id);

    const token = generateToken({
      id: admin._id,
      role: admin.role,
    });

    return res.status(200).json(
      apiResponse.success("Login successful.", {
        admin,
        token,
      })
    );
  });
}

export default new AuthController();