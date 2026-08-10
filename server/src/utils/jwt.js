import jwt from "jsonwebtoken";
import crypto from "crypto";
import { env } from "../config/env.js";

/*
===========================================================
Access Token
===========================================================
*/

export const generateToken = (payload) => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, env.JWT_SECRET);
};

/*
===========================================================
Refresh Token
===========================================================
*/

/*
 * Refresh token is a cryptographically secure random value.
 * It is NOT a JWT.
 */
export const generateRefreshToken = () => {
  return crypto.randomBytes(64).toString("hex");
};

/*
 * Only hash is stored in MongoDB.
 */
export const hashRefreshToken = (token) => {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
};