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

let decoded;

try {

    decoded = jwt.verify(token, env.JWT_SECRET);

} catch {

    return res
        .status(401)
        .json(apiResponse.error("Invalid or expired token."));

}

// Validate Payload

if (!decoded.id || !decoded.role) {

    return res
        .status(401)
        .json(apiResponse.error("Invalid token."));

}

// Validate Role

if (
    !["Admin", "SuperAdmin", "Customer"].includes(decoded.role)
) {

    return res
        .status(401)
        .json(apiResponse.error("Unauthorized."));

}
      
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

        if (!admin.isActive) {
          return res
            .status(401)
            .json(
              apiResponse.error(
                "Admin account is inactive."
              )
            );
        }

        
        req.admin = admin;
        req.user = admin;
        
        req.user.role = decoded.role;


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
    
    if (customer.isDeleted) {
  return res
    .status(401)
    .json(apiResponse.error("Customer account is deleted."));
   }

  if (!customer.isActive) {
  return res
    .status(401)
    .json(apiResponse.error("Customer account is inactive."));
  }

    req.user = customer;
    req.user.role = decoded.role;

    return next();
  }

  return res
    .status(401)
    .json(apiResponse.error("Unauthorized."));
});

export default authMiddleware;