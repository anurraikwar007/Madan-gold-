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