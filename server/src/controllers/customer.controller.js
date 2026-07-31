import asyncHandler from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";

import {
  registerCustomer,
  loginCustomer,
} from "../services/auth.service.js";

// =========================
// Customer Register
// =========================

export const register = asyncHandler(async (req, res) => {
  const customer = await registerCustomer(req.body);

  return res.status(201).json(
    apiResponse.success(
      "Customer registered successfully.",
      customer
    )
  );
});

// =========================
// Customer Login
// =========================

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const data = await loginCustomer(email, password);

  return res.status(200).json(
    apiResponse.success(
      "Login successful.",
      data
    )
  );
});

// =========================
// Customer Profile
// =========================

export const profile = asyncHandler(async (req, res) => {
  return res.status(200).json(
    apiResponse.success(
      "Profile fetched successfully.",
      req.user
    )
  );
});

export const changePassword = asyncHandler(async (req, res) => {

  const {
    oldPassword,
    newPassword,
  } = req.body;


  const customer = await Customer.findById(req.user.id);


  if (!customer) {
    return res
      .status(404)
      .json(
        apiResponse.error("Customer not found")
      );
  }


  const isMatch = await customer.comparePassword(
    oldPassword
  );


  if (!isMatch) {
    return res
      .status(401)
      .json(
        apiResponse.error("Old password is incorrect")
      );
  }


  customer.password = newPassword;

  await customer.save();


  return res.status(200).json(
    apiResponse.success(
      "Password changed successfully"
    )
  );

});