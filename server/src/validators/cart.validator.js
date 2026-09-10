import Joi from "joi";

  export const addToCartSchema = {
    params: Joi.object({
      productId: Joi.string()
        .length(24)
        .hex()
        .required(),
    }),

    body: Joi.object({
      quantity: Joi.number()
        .integer()
        .min(1)
        .max(100)
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