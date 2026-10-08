import Joi from "joi";

export const createCouponSchema = {
  body: Joi.object({
    code: Joi.string()
      .trim()
      .uppercase()
      .required(),

    description: Joi.string()
      .allow("")
      .default(""),

      image: Joi.object({
      public_id: Joi.string()
        .trim()
        .allow(""),

      url: Joi.string()
        .uri()
        .allow(""),

      alt: Joi.string()
        .trim()
        .max(150)
        .allow(""),
    }).optional(),

    discountType: Joi.string()
      .trim()
      .custom((value, helpers) => {
        const normalized = String(value).toLowerCase();
        if (normalized === "percentage") return "Percentage";
        if (normalized === "flat") return "Flat";
        return helpers.error("any.only");
      })
      .required()
      .messages({
        "any.only": "Discount type must be Percentage or Flat.",
      }),

    discountValue: Joi.number()
      .positive()
      .required(),

    minimumOrderAmount: Joi.number()
      .min(0)
      .default(0),

    maximumDiscount: Joi.number()
      .min(0)
      .default(0),

    usageLimit: Joi.number()
      .integer()
      .min(1)
      .default(1),

    validFrom: Joi.date().required(),

    validTill: Joi.date().greater(Joi.ref("validFrom")).required(),

    isActive: Joi.boolean().default(true),
  }),
};

export const updateCouponSchema = {
  body: Joi.object({
    code: Joi.string()
      .trim()
      .uppercase(),

    description: Joi.string().allow(""),

        image: Joi.object({
      public_id: Joi.string()
        .trim()
        .allow(""),

      url: Joi.string()
        .uri()
        .allow(""),

      alt: Joi.string()
        .trim()
        .max(150)
        .allow(""),
    }).optional(),

    discountType: Joi.string()
      .trim()
      .custom((value, helpers) => {
        const normalized = String(value).toLowerCase();
        if (normalized === "percentage") return "Percentage";
        if (normalized === "flat") return "Flat";
        return helpers.error("any.only");
      })
      .messages({
        "any.only": "Discount type must be Percentage or Flat.",
      }),

    discountValue: Joi.number().positive(),

    minimumOrderAmount: Joi.number().min(0),

    maximumDiscount: Joi.number().min(0),

    usageLimit: Joi.number().integer().min(1),

    validFrom: Joi.date(),

    validTill: Joi.date(),

    isActive: Joi.boolean(),
  }),
};

export const applyCouponSchema = {
  body: Joi.object({
    code: Joi.string()
      .trim()
      .uppercase()
      .required(),
  }),
};

export const couponIdSchema = {
  params: Joi.object({
    id: Joi.string()
      .length(24)
      .hex()
      .required(),
  }),
};