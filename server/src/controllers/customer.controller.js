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

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { customer, token } = await loginCustomer(email, password);

  customer.password = undefined;

  return res.status(200).json(
    apiResponse.success("Login successful.", {
      customer,
      token,
    })
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

export const changePassword = asyncHandler(async (req, res) => {

    const {
        oldPassword,
        newPassword,
    } = req.body;

    const customer = await Customer
        .findById(req.user.id)
        .select("+password");

    if (!customer) {
        return res
            .status(404)
            .json(apiResponse.error("Customer not found"));
    }

    const isMatch =
        await customer.comparePassword(oldPassword);

    if (!isMatch) {
        return res
            .status(401)
            .json(apiResponse.error("Old password is incorrect"));
    }

    customer.password = newPassword;

    await customer.save();

    customer.password = undefined;

    return res.status(200).json(
        apiResponse.success(
            "Password changed successfully."
        )
    );

});

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