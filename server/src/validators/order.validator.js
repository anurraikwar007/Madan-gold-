import Joi from "joi";

export const createOrderSchema = {
  body: Joi.object({
    paymentMethod: Joi.string()
      .valid("COD", "ONLINE")
      .required(),

    shippingAddress: Joi.object({
      fullName: Joi.string().trim().required(),

      phone: Joi.string()
        .pattern(/^[6-9]\d{9}$/)
        .required(),

      house: Joi.string().trim().required(),

      area: Joi.string().trim().required(),

      landmark: Joi.string().trim().allow("").default(""),

      city: Joi.string().trim().required(),

      state: Joi.string().trim().required(),

      country: Joi.string().trim().default("India"),

      pincode: Joi.string()
        .pattern(/^[1-9][0-9]{5}$/)
        .required(),
    }).required(),

    couponCode: Joi.string()
      .trim()
      .uppercase()
      .allow("")
      .optional(),
  }),
};

export const updateOrderStatusSchema = {
  body: Joi.object({
    orderStatus: Joi.string()
      .valid(
        "Pending",
        "Confirmed",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled"
      )
      .required(),
  }),
};

export const paymentVerificationSchema = {
  body: Joi.object({
    razorpayOrderId: Joi.string().required(),

    razorpayPaymentId: Joi.string().required(),

    razorpaySignature: Joi.string().required(),
  }),
};