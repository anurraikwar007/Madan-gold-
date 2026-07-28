import Joi from "joi";

export const addToCartSchema = {
  body: Joi.object({
    productId: Joi.string()
      .length(24)
      .hex()
      .required(),

    quantity: Joi.number()
      .integer()
      .min(1)
      .default(1),
  }),
};

export const updateCartSchema = {
  body: Joi.object({
    quantity: Joi.number()
      .integer()
      .min(1)
      .required(),
  }),

  params: Joi.object({
    productId: Joi.string()
      .length(24)
      .hex()
      .required(),
  }),
};

export const removeCartItemSchema = {
  params: Joi.object({
    productId: Joi.string()
      .length(24)
      .hex()
      .required(),
  }),
};