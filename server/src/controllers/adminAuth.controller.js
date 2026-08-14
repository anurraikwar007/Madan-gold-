import asyncHandler from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { generateToken } from "../utils/jwt.js";

import {
  findAdminByEmail,
  updateLastLogin,
} from "../services/auth.service.js";

import {
  createRefreshToken,
  revokeRefreshToken,
  revokeAllRefreshTokens,
} from "../services/token.service.js";

import {
  setRefreshTokenCookie,
  getRefreshTokenFromRequest,
  clearRefreshTokenCookie,
} from "../utils/authCookie.js";

// =========================
// Admin Login
// =========================

export const login = asyncHandler(
  async (req, res) => {
    const {
      email,
      password,
    } = req.body;

    const admin =
      await findAdminByEmail(email);

    if (!admin) {
      return res.status(401).json(
        apiResponse.error(
          "Invalid email or password"
        )
      );
    }

    const isMatch =
      await admin.comparePassword(
        password
      );

    if (!isMatch) {
      return res.status(401).json(
        apiResponse.error(
          "Invalid email or password"
        )
      );
    }

    if (!admin.isActive) {
      return res.status(403).json(
        apiResponse.error(
          "Admin account is inactive."
        )
      );
    }

    await updateLastLogin(admin._id);

    const accessToken =
      generateToken({
        id: admin._id,
        role: admin.role,
      });

    const refreshToken =
      await createRefreshToken({
        userId: admin._id,
        userType: "Admin",
        device:
          req.headers["user-agent"] ||
          "Unknown",
        ipAddress:
          req.ip || null,
      });

    admin.password = undefined;

      const adminData =
        admin.toObject();

      delete adminData.password;

      return res.status(200).json(
      apiResponse.success(
        "Login successful",
        {
          accessToken,

          admin: adminData,

          refreshTokenExpiresAt:
          refreshToken.expiresAt,
        }
      )
    );
  }
);

// =========================
// Admin Logout
// =========================

export const logout = asyncHandler(
  async (req, res) => {
    const refreshToken =
      getRefreshTokenFromRequest(req);

    if (refreshToken) {
      await revokeRefreshToken(
        refreshToken
      );
    }

    clearRefreshTokenCookie(res);

    return res.status(200).json(
      apiResponse.success(
        "Admin logout successful."
      )
    );
  }
);
  // =========================
// Admin Logout All Devices
// =========================

export const logoutAll = asyncHandler(
  async (req, res) => {
    await revokeAllRefreshTokens({
      userId: req.admin._id,
      userType: "Admin",
    });

    clearRefreshTokenCookie(res);

    return res.status(200).json(
      apiResponse.success(
        "Admin logged out from all devices successfully."
      )
    );
  }
);

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