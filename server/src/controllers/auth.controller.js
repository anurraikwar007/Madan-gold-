import asyncHandler from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";

import {
  registerCustomer,
  loginCustomer,
  findAdminByEmail,
  updateLastLogin,
} from "../services/auth.service.js";

import {
  createRefreshToken,
  rotateRefreshToken,
} from "../services/token.service.js";

import {
  getRefreshTokenFromRequest,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
} from "../utils/authCookie.js";



import { generateToken } from "../utils/jwt.js";

class AuthController {
  // Customer Registration
  register = asyncHandler(async (req, res) => {
    const customer = await registerCustomer(req.body);

    return res.status(201).json(
      apiResponse.success(
        "Customer registered successfully.",
        customer
      )
    );
  }); 

  // Customer Login

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
   
  // Admin Login
  
  adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await findAdminByEmail(email);

  if (!admin) {
    throw new Error("Invalid email or password");
  }

  const isMatch =
    await admin.comparePassword(password);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  await updateLastLogin(admin._id);

  /*
   * Generate short-lived access token
   */
  const accessToken = generateToken({
    id: admin._id,
    role: admin.role,
  });

  /*
   * Generate refresh token
   */
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

  /*
   * Store refresh token
   * in HttpOnly cookie
   */
  setRefreshTokenCookie(
    res,
    refreshToken.token
  );

  return res.status(200).json(
    apiResponse.success(
      "Login successful.",
      {
        admin,

        accessToken,

        refreshTokenExpiresAt:
          refreshToken.expiresAt,
      }
    )
  );
});



//  ===========================================================
//  REFRESH ACCESS TOKEN
//  ===========================================================

refreshAccessToken = asyncHandler(
  async (req, res) => {
    const refreshToken =
      getRefreshTokenFromRequest(req);

    if (!refreshToken) {
      return res.status(401).json(
        apiResponse.error(
          "Refresh token is required."
        )
      );
    }

    try {
      /*
       * Rotate old refresh token
       * and generate a new one.
       */
      const result =
        await rotateRefreshToken({
          rawToken: refreshToken,

          device:
            req.headers["user-agent"] ||
            "Unknown",

          ipAddress:
            req.ip || null,
        });

      /*
       * Generate new access token.
       */
      const accessToken =
        generateToken({
          id: result.userId,

          role: result.role,
        });

      /*
       * Replace old refresh-token
       * cookie with the new token.
       */
      setRefreshTokenCookie(
        res,
        result.token
      );

      return res.status(200).json(
        apiResponse.success(
          "Access token refreshed successfully.",
          {
            accessToken,

            expiresAt:
              result.expiresAt,
          }
        )
      );
    } catch (error) {
      /*
       * Invalid / expired /
       * already-used refresh token.
       */
      clearRefreshTokenCookie(res);

      return res.status(401).json(
        apiResponse.error(
          "Invalid or expired refresh token."
        )
      );
    }
  }
);

 }

export default new AuthController();