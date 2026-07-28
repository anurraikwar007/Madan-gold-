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

    discountType: Joi.string()
      .valid("Percentage", "Flat")
      .required(),

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

    discountType: Joi.string().valid("Percentage", "Flat"),

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