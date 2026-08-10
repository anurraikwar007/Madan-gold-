import RefreshTokenRepository from "../repositories/refreshToken.repository.js";
import Customer from "../models/customer.model.js";
import Admin from "../models/admin.model.js";

import {
  generateRefreshToken,
  hashRefreshToken,
} from "../utils/jwt.js";

import { env } from "../config/env.js";

let role = null;


/*
===========================================================
Create Refresh Token
===========================================================
*/

export const createRefreshToken = async ({
  userId,
  userType,
  device = "Unknown",
  ipAddress = null,
}) => {
  const rawToken = generateRefreshToken();

  const tokenHash =
    hashRefreshToken(rawToken);

  const expiresAt = new Date();

  expiresAt.setDate(
    expiresAt.getDate() +
      env.REFRESH_TOKEN_DAYS
  );

  await RefreshTokenRepository.create({
    userId,
    userType,
    tokenHash,
    expiresAt,
    device,
    ipAddress,
  });

  return {
    token: rawToken,
    expiresAt,
  };
};

/*
===========================================================
Validate Refresh Token
===========================================================
*/

export const findValidRefreshToken = async (
  rawToken
) => {
  if (!rawToken) {
    return null;
  }

  const tokenHash =
    hashRefreshToken(rawToken);

  return RefreshTokenRepository.findValidToken(
    tokenHash
  );
};

/*
===========================================================
Rotate Refresh Token
===========================================================
*/

export const rotateRefreshToken = async ({
  rawToken,
  device = "Unknown",
  ipAddress = null,
}) => {
  if (!rawToken) {
    throw new Error(
      "Refresh token is required."
    );
  }

  const oldTokenHash =
    hashRefreshToken(rawToken);

  const newRawToken =
    generateRefreshToken();

  const newTokenHash =
    hashRefreshToken(newRawToken);

  const existingToken =
    await RefreshTokenRepository.consumeValidToken(
      oldTokenHash,
      newTokenHash
    );

  if (!existingToken) {
  throw new Error(
    "Invalid or expired refresh token."
  );
}

let role;

if (existingToken.userType === "Customer") {
  const customer = await Customer.findById(
    existingToken.userId
  );

  if (!customer) {
    throw new Error("Customer not found.");
  }

  if (customer.isDeleted) {
    throw new Error(
      "Customer account is deleted."
    );
  }

  if (!customer.isActive) {
    throw new Error(
      "Customer account is inactive."
    );
  }

  role = "Customer";
}

if (existingToken.userType === "Admin") {
  const admin = await Admin.findById(
    existingToken.userId
  );

  if (!admin) {
    throw new Error("Admin not found.");
  }

  if (!admin.isActive) {
    throw new Error(
      "Admin account is inactive."
    );
  }

  role = admin.role;
}

  const expiresAt = new Date();

  expiresAt.setDate(
    expiresAt.getDate() +
      env.REFRESH_TOKEN_DAYS
  );

  await RefreshTokenRepository.create({
    userId: existingToken.userId,
    userType: existingToken.userType,
    tokenHash: newTokenHash,
    expiresAt,
    device,
    ipAddress,
  });

  return {
    token: newRawToken,
    expiresAt,
    userId: existingToken.userId,
    userType: existingToken.userType,
    role,
  };
};

/*
===========================================================
Logout Current Session
===========================================================
*/

export const revokeRefreshToken = async (
  rawToken
) => {
  if (!rawToken) {
    return;
  }

  const tokenHash =
    hashRefreshToken(rawToken);

  await RefreshTokenRepository.revokeByHash(
    tokenHash,
     
  );
};

/*
===========================================================
Logout All Devices
===========================================================
*/

export const revokeAllRefreshTokens = async ({
  userId,
  userType,
}) => {
  return RefreshTokenRepository.revokeAllForUser(
    userId,
    userType
  );
};