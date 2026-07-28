import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

// Generate JWT Token
export const generateToken = (payload) => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
};

// Verify JWT Token
export const verifyToken = (token) => {
  return jwt.verify(token, env.JWT_SECRET);
};