import Joi from "joi";

export const registerSchema = {
  body: Joi.object({
    name: Joi.string().trim().min(3).max(50).required(),

    email: Joi.string().email().lowercase().required(),

    phone: Joi.string()
      .pattern(/^[6-9]\d{9}$/)
      .required()
      .messages({
        "string.pattern.base": "Phone number must be a valid 10 digit Indian mobile number",
      }),

    password: Joi.string().min(6).max(20).required(),

    gender: Joi.string()
      .valid("Male", "Female", "Other")
      .optional(),
  }),
};

export const loginSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),

    password: Joi.string().required(),
  }),
};

  // ======================================================
// Update Profile
// ======================================================

export const updateProfileSchema = {

    body: Joi.object({

        name: Joi.string()
            .trim()
            .min(2)
            .max(100),

        phone: Joi.string()
            .trim()
            .pattern(/^[6-9]\d{9}$/),

        gender: Joi.string()
            .valid(
                "Male",
                "Female",
                "Other"
            ),

        dob: Joi.date(),

    }),

};

// ======================================================
// Change Password
// ======================================================

export const changePasswordSchema = {
  body: Joi.object({
    oldPassword: Joi.string()
      .required(),

    newPassword: Joi.string()
      .min(6)
      .max(20)
      .required()
      .disallow(
        Joi.ref("oldPassword")
      )
      .messages({
        "any.invalid":
          "New password must be different from old password.",
      }),
  }),
};

// ======================================================
// Admin Login
// ====================================================== 

export const adminLoginSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),

    password: Joi.string().required(),
  }),
  
};

// ======================================================
// Verify Customer Email
// ======================================================

export const verifyEmailSchema = {
  body: Joi.object({
    email: Joi.string()
      .email()
      .lowercase()
      .required(),

    otp: Joi.string()
      .pattern(/^\d{6}$/)
      .required()
      .messages({
        "string.pattern.base":
          "OTP must be a valid 6 digit code.",
      }),
  }),
}

// ======================================================
// Resend Customer Verification Email
// ======================================================

export const resendVerificationSchema = {
  body: Joi.object({
    email: Joi.string()
      .email()
      .lowercase()
      .required(),
  }),
};

export const forgotPasswordSchema = {
  body: Joi.object({
    email: Joi.string()
      .email()
      .lowercase()
      .required(),
  }),
};

export const resetPasswordSchema = {
  body: Joi.object({
    token: Joi.string()
      .min(32)
      .required(),

    password: Joi.string()
      .min(6)
      .max(20)
      .required(),
  }),
};

export const addressSchema = {
  body: Joi.object({
    type: Joi.string()
      .valid(
        "Home",
        "Work",
        "Other"
      )
      .default("Home"),

    fullName: Joi.string()
      .trim()
      .min(2)
      .max(100)
      .required(),

    phone: Joi.string()
      .trim()
      .pattern(/^[6-9]\d{9}$/)
      .required()
      .messages({
        "string.pattern.base":
          "Phone number must be a valid 10 digit Indian mobile number",
      }),

    pincode: Joi.string()
      .pattern(/^\d{6}$/)
      .required(),

    house: Joi.string()
      .trim()
      .min(1)
      .max(200)
      .required(),

    area: Joi.string()
      .trim()
      .min(2)
      .max(200)
      .required(),

    landmark: Joi.string()
      .trim()
      .max(200)
      .allow(""),

    city: Joi.string()
      .trim()
      .min(2)
      .max(100)
      .required(),

    state: Joi.string()
      .trim()
      .min(2)
      .max(100)
      .required(),

    country: Joi.string()
      .trim()
      .default("India"),

    isDefault: Joi.boolean()
      .default(false),
  }),
};

export const updateAddressSchema = {
  params: Joi.object({
    id: Joi.string()
      .length(24)
      .hex()
      .required(),
  }),

  body: Joi.object({
    type: Joi.string()
      .valid(
        "Home",
        "Work",
        "Other"
      ),

    fullName: Joi.string()
      .trim()
      .min(2)
      .max(100),

    phone: Joi.string()
      .trim()
      .pattern(/^[6-9]\d{9}$/),

    pincode: Joi.string()
      .pattern(/^\d{6}$/),

    house: Joi.string()
      .trim()
      .min(1)
      .max(200),

    area: Joi.string()
      .trim()
      .min(2)
      .max(200),

    landmark: Joi.string()
      .trim()
      .max(200)
      .allow(""),

    city: Joi.string()
      .trim()
      .min(2)
      .max(100),

    state: Joi.string()
      .trim()
      .min(2)
      .max(100),

    country: Joi.string()
      .trim(),

    isDefault: Joi.boolean(),
  }).min(1),
};