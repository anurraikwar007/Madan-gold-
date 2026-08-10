import asyncHandler from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";

import {
  registerCustomer,
  loginCustomer,
  updateProfile,
  updateAvatar,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} from "../services/auth.service.js";

import {
  revokeRefreshToken,
  revokeAllRefreshTokens,
} from "../services/token.service.js";

import {
  setRefreshTokenCookie,
  getRefreshTokenFromRequest,
  clearRefreshTokenCookie,
} from "../utils/authCookie.js";

import Customer from "../models/customer.model.js";

// =========================
// Customer Register
// =========================

export const register = asyncHandler(async (req, res) => {

    const createdCustomer = await registerCustomer(req.body);

    const customer = await Customer
        .findById(createdCustomer._id)
        .select("-password");

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

export const login = asyncHandler(
  async (req, res) => {
    const {
      email,
      password,
    } = req.body;

    const result =
      await loginCustomer(
        email,
        password,
        {
          device:
            req.headers["user-agent"] ||
            "Unknown",

          ipAddress:
            req.ip || null,
        }
      );

    setRefreshTokenCookie(
      res,
      result.refreshToken
    );

    delete result.refreshToken;

    return res.status(200).json(
      apiResponse.success(
        "Login successful.",
        result
      )
    );
  }
);

 // =========================
// Logout Current Session
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
        "Logout successful."
      )
    );
  }
);
 
// =========================
// Logout All Devices
// =========================

export const logoutAll = asyncHandler(
  async (req, res) => {
    await revokeAllRefreshTokens({
      userId: req.user._id,
      userType: "Customer",
    });

    clearRefreshTokenCookie(res);

    return res.status(200).json(
      apiResponse.success(
        "Logged out from all devices successfully."
      )
    );
  }
);

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

// =========================
// Update Customer Profile
// =========================

export const updateCustomerProfile = asyncHandler(async (req, res) => {

    const customer = await updateProfile(
        req.user.id,
        req.body
    );

    return res.status(200).json(
        apiResponse.success(
            "Profile updated successfully.",
            customer
        )
    );

});

   // =========================
    // Update Customer Avatar
    // =========================

export const uploadAvatar = asyncHandler(async (req, res) => {

    if (!req.file) {
        return res.status(400).json(
            apiResponse.error("Avatar is required")
        );
    }

    const avatar = {
        public_id: req.file.filename,
        url: req.file.path,
    };

    const customer = await updateAvatar(
        req.user.id,
        avatar
    );

    return res.status(200).json(
        apiResponse.success(
            "Avatar updated successfully.",
            customer
        )
    );

});

// =========================
// Change Password
// =========================

export const changePassword = asyncHandler(
  async (req, res) => {
    const {
      oldPassword,
      newPassword,
    } = req.body;

    const customer = await Customer
      .findById(req.user.id)
      .select("+password");

    if (!customer) {
      return res.status(404).json(
        apiResponse.error(
          "Customer not found."
        )
      );
    }

    const isMatch =
      await customer.comparePassword(
        oldPassword
      );

    if (!isMatch) {
      return res.status(401).json(
        apiResponse.error(
          "Old password is incorrect."
        )
      );
    }

    /*
     * Update password
     */
    customer.password = newPassword;

    await customer.save();

    /*
     * Revoke all refresh-token sessions.
     *
     * This logs the customer out from
     * all devices/sessions.
     */
    await revokeAllRefreshTokens({
      userId: customer._id,
      userType: "Customer",
    });

    /*
     * Clear current browser's refresh-token
     * cookie as well.
     */
    clearRefreshTokenCookie(res);

    /*
     * Never expose password.
     */
    customer.password = undefined;

    return res.status(200).json(
      apiResponse.success(
        "Password changed successfully. Please login again."
      )
    );
  }
);

// =========================
// Get Addresses
// =========================

export const getCustomerAddresses = asyncHandler(async (req, res) => {

    const addresses = await getAddresses(req.user.id);

    return res.status(200).json(
        apiResponse.success(
            "Addresses fetched successfully.",
            addresses
        )
    );

});

// =========================
// Add Address
// =========================

    export const addCustomerAddress = asyncHandler(async (req, res) => {

        const addresses = await addAddress(
            req.user.id,
            req.body
        );

        return res.status(201).json(
            apiResponse.success(
                "Address added successfully.",
                addresses
            )
        );

    });

// =========================
// Update Address
// =========================

    export const updateCustomerAddress = asyncHandler(async (req, res) => {

        const addresses = await updateAddress(
            req.user.id,
            req.params.id,
            req.body
        );

        return res.status(200).json(
            apiResponse.success(
                "Address updated successfully.",
                addresses
            )
        );

    });

// =========================
// Delete Address
// =========================

    export const deleteCustomerAddress = asyncHandler(async (req, res) => {

        const addresses = await deleteAddress(
            req.user.id,
            req.params.id
        );

        return res.status(200).json(
            apiResponse.success(
                "Address deleted successfully.",
                addresses
            )
        );

    });