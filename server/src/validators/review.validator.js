import Joi from "joi";

export const createReviewSchema = {
  body: Joi.object({
    productId: Joi.string()
      .length(24)
      .hex()
      .required(),

    rating: Joi.number()
      .integer()
      .min(1)
      .max(5)
      .required(),

    title: Joi.string()
      .trim()
      .max(100)
      .allow("")
      .optional(),

    comment: Joi.string()
      .trim()
      .min(5)
      .max(1000)
      .required(),
  }),
};

export const updateReviewSchema = {
  body: Joi.object({
    rating: Joi.number()
      .integer()
      .min(1)
      .max(5),

    title: Joi.string()
      .trim()
      .max(100)
      .allow(""),

    comment: Joi.string()
      .trim()
      .min(5)
      .max(1000),
  }),
};

export const deleteReviewSchema = {
  params: Joi.object({
    reviewId: Joi.string()
      .length(24)
      .hex()
      .required(),
  }),
};