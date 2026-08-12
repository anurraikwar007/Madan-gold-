import RefreshTokenRepository from "../repositories/refreshToken.repository.js";
import CustomerRepository from "../repositories/customer.repository.js";
import Admin from "../models/admin.model.js";
import Customer from "../models/customer.model.js";
import cloudinary from "../config/cloudinary.js";
import { generateToken } from "../utils/jwt.js";
import {
  createRefreshToken,
  rotateRefreshToken,
  revokeRefreshToken,
  revokeAllRefreshTokens,
} from "./token.service.js";

import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendCustomerVerificationOtp } from "./email.service.js";

// =========================
// Customer Register
// =========================

export const registerCustomer = async (data) => {
  const {
    name,
    email,
    phone,
    password,
    gender,
  } = data;

  const emailExists =
    await Customer.findOne({ email });

  if (emailExists) {
    throw new Error(
      "Email already registered"
    );
  }

  const phoneExists =
    await Customer.findOne({ phone });

  if (phoneExists) {
    throw new Error(
      "Phone already registered"
    );
  }

  // 6 digit OTP
  const otp =
    crypto.randomInt(100000, 1000000).toString();

  // Hash OTP before storing
  const hashedOtp =
    crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

  const otpExpiresAt =
    new Date(
      Date.now() + 10 * 60 * 1000
    );

  const customer =
    await Customer.create({
      name,
      email,
      phone,
      password,
      gender,

      isVerified: false,

      emailVerificationOtp:
        hashedOtp,

      emailVerificationOtpExpiresAt:
        otpExpiresAt,
    });

  try {
    await sendCustomerVerificationOtp(
      email,
      otp
    );
  } catch (error) {
    // Email fail hua to unverified
    // account database me mat chhodo.
    await Customer.findByIdAndDelete(
      customer._id
    );

    throw new Error(
      "Unable to send verification OTP. Please try again."
    );
  }

  return customer;
};
// =========================
// Customer Login
// =========================

export const loginCustomer = async (
  email,
  password,
  options = {}
) => {
  const customer =
    await Customer.findOne({ email })
      .select("+password");

  if (!customer) {
    throw new Error(
      "Invalid email or password"
    );
  }

 if (
    !customer.isActive ||
    customer.isDeleted
    ) {
    throw new Error(
        "Your account is inactive or deleted."
    );
    }

  const isMatch =
    await customer.comparePassword(password);

  if (!isMatch) {
    throw new Error(
      "Invalid email or password"
    );
  }

  if (!customer.isVerified) {
  throw new Error(
    "Please verify your email before logging in."
     );
   }

  customer.lastLogin = new Date();

  await customer.save();

  const accessToken =
    generateToken({
      id: customer._id,
      role: "Customer",
    });

  const refreshToken =
    await createRefreshToken({
      userId: customer._id,
      userType: "Customer",
      device:
        options.device || "Unknown",
      ipAddress:
        options.ipAddress || null,
    });

  customer.password = undefined;

  return {
    customer,

    accessToken,

    refreshToken:
      refreshToken.token,

    refreshTokenExpiresAt:
      refreshToken.expiresAt,
  };
};

// ======================================================
// Update Profile
// ======================================================

export const updateProfile = async (
    customerId,
    payload
) => {

    const customer =
        await CustomerRepository.findById(customerId);

    if (!customer) {

        throw new Error(
            "Customer not found."
        );

    }

    if (
        payload.phone &&
        payload.phone !== customer.phone
    ) {

        const exists =
            await CustomerRepository.findOne({

                phone: payload.phone,

                _id: {
                    $ne: customerId,
                },

            });

        if (exists) {

            throw new Error(
                "Phone already exists."
            );

        }

    }

    const allowedFields = [
    "name",
    "phone",
    "gender",
    "dob"
    ];

    for (const field of allowedFields) {
    if (payload[field] !== undefined) {
        customer[field] = payload[field];
    }
    }

    await customer.save();

    customer.password = undefined;

    return customer;

};

   // =========================
  // Update Customer Avatar
 // =========================

  export const updateAvatar = async (
    customerId,
    avatar
) => {

    const customer =
        await Customer.findById(customerId);

    if (!customer) {
        throw new Error("Customer not found");
    }

    // Delete old avatar
    if (customer.avatar?.public_id) {

        await cloudinary.uploader.destroy(
            customer.avatar.public_id
        );

    }

    customer.avatar = avatar;

    await customer.save();

    customer.password = undefined;

    return customer;

 };
 
   // =========================
  // Get Customer Addresses
 // =========================

    export const getAddresses = async (
        customerId
    ) => {

        const customer =
            await Customer.findById(customerId);

        if (!customer) {
            throw new Error("Customer not found");
        }

        return customer.addresses;

    };

     // =========================
    // Add Customer Address
   // =========================

    export const addAddress = async (
        customerId,
        payload
    ) => {

        const customer =
            await Customer.findById(customerId);

        if (!customer) {
            throw new Error("Customer not found");
        }

        if (payload.isDefault) {

            customer.addresses.forEach(address => {
                address.isDefault = false;
            });

        }

        customer.addresses.push(payload);

        await customer.save();

        return customer.addresses;

    };
     // =========================
    // Update Customer Address
   // =========================

    export const updateAddress = async (
        customerId,
        addressId,
        payload
    ) => {

        const customer =
            await Customer.findById(customerId);

        if (!customer) {
            throw new Error("Customer not found");
        }

        const address =
            customer.addresses.id(addressId);

        if (!address) {
            throw new Error("Address not found");
        }

        if (payload.isDefault) {

            customer.addresses.forEach(item => {
                item.isDefault = false;
            });

        }

        const allowedFields = [
        "fullName",
        "phone",
        "house",
        "area",
        "city",
        "state",
        "pincode",
        "landmark",
        "type",
        "isDefault"
        ];

        for (const field of allowedFields) {
        if (payload[field] !== undefined) {
            address[field] = payload[field];
        }
        }
        await customer.save();

        return customer.addresses;

    };
   
    // =========================
    // Delete Customer Address
    // =========================

    export const deleteAddress = async (
        customerId,
        addressId
    ) => {

        const customer =
            await Customer.findById(customerId);

        if (!customer) {
            throw new Error("Customer not found");
        }

        const address =
            customer.addresses.id(addressId);

        if (!address) {
            throw new Error("Address not found");
        }

        address.deleteOne();

        await customer.save();

        return customer.addresses;

    };

    // =========================
    // Admin Functions
    // =========================

    export const findAdminByEmail = async (email) => {
      return await Admin.findOne({ email }).select("+password");
    };
    
    // =========================
    // Update Admin Last Login
    // =========================
    
    export const updateLastLogin = async (id) => {
      return await Admin.findByIdAndUpdate(id, {
        lastLogin: new Date(),
      });
};
   
   // =========================
   // VerifyCutomerEmail
   // =========================

export const verifyCustomerEmail = async (
  email,
  otp
) => {
  const customer =
    await Customer.findOne({ email })
      .select(
        "+emailVerificationOtp +emailVerificationOtpExpiresAt"
      );

  if (!customer) {
    throw new Error(
      "Invalid email or OTP."
    );
  }

  if (customer.isVerified) {
    throw new Error(
      "Email is already verified."
    );
  }

  if (
    !customer.emailVerificationOtp ||
    !customer.emailVerificationOtpExpiresAt
  ) {
    throw new Error(
      "Verification OTP is not available."
    );
  }

  if (
    customer.emailVerificationOtpExpiresAt <
    new Date()
  ) {
    throw new Error(
      "Verification OTP has expired."
    );
  }

  const hashedOtp =
    crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

  if (
    hashedOtp !==
    customer.emailVerificationOtp
  ) {
    throw new Error(
      "Invalid verification OTP."
    );
  }

  customer.isVerified = true;
  customer.emailVerificationOtp = null;
  customer.emailVerificationOtpExpiresAt = null;

  await customer.save();

  return customer;
};

// =========================
// Resend Customer Verification OTP
// =========================

export const resendCustomerVerificationOtp = async (email) => {
  const customer = await Customer.findOne({ email });

  if (!customer) {
    throw new Error("Customer not found.");
  }

  if (customer.isVerified) {
    throw new Error("Email is already verified.");
  }

  // Generate new 6 digit OTP
  const otp = crypto
    .randomInt(100000, 1000000)
    .toString();

  // Hash OTP before storing
  const hashedOtp = crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");

  const otpExpiresAt = new Date(
    Date.now() + 10 * 60 * 1000
  );

  customer.emailVerificationOtp = hashedOtp;
  customer.emailVerificationOtpExpiresAt =
    otpExpiresAt;

  await customer.save();

  try {
    await sendCustomerVerificationOtp(
      customer.email,
      otp
    );
  } catch (error) {
    console.error(
      "[EMAIL] Resend verification OTP failed:",
      error
    );

    throw new Error(
      "Unable to send verification OTP. Please try again."
    );
  }

  return true;
};