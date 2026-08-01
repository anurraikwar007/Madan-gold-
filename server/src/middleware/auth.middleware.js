import jwt from "jsonwebtoken";

import asyncHandler from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { env } from "../config/env.js";

import Admin from "../models/admin.model.js";
import Customer from "../models/customer.model.js";

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token = null;

  // Bearer Token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res
      .status(401)
      .json(apiResponse.error("Unauthorized. Token missing."));
  }

  // Verify JWT
  console.log("================================");
  console.log("Authorization Header:");
  console.log(req.headers.authorization);
  console.log("================================");

  const decoded = jwt.verify(token, env.JWT_SECRET);
  
  
 // Admin
if (
    decoded.role === "Admin" ||
    decoded.role === "SuperAdmin"
) {
    const admin = await Admin.findById(decoded.id);

    if (!admin) {
    return res
      .status(401)
      .json(apiResponse.error("Admin not found."));
    }

    console.log("Calling next()");
    req.admin = admin;
    req.user = admin;

    return next();
    }

  // Customer
  if (decoded.role === "Customer") {
    const customer = await Customer.findById(decoded.id);

    if (!customer) {
      return res
        .status(401)
        .json(apiResponse.error("Customer not found."));
    }

    req.user = customer;

    return next();
  }

  return res
    .status(401)
    .json(apiResponse.error("Unauthorized."));
});

export default authMiddleware;