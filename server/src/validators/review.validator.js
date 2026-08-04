import Joi from "joi";

// =====================================
// Image Schema
// =====================================

const imageSchema = Joi.object({
  public_id: Joi.string().required(),
  url: Joi.string().uri().required(),
});

// =====================================
// Create Review
// =====================================

export const createReviewValidator = {
  body: Joi.object({
    product: Joi.string().length(24).hex().required(),

    rating: Joi.number()
      .integer()
      .min(1)
      .max(5)
      .required(),

    title: Joi.string()
      .trim()
      .allow("")
      .max(120)
      .default(""),

    comment: Joi.string()
      .trim()
      .min(3)
      .max(2000)
      .required(),

    images: Joi.array()
      .items(imageSchema)
      .default([]),
  }),
};

// =====================================
// Update Review
// =====================================

export const updateReviewValidator = {
  params: Joi.object({
    reviewId: Joi.string()
      .length(24)
      .hex()
      .required(),
  }),

  body: Joi.object({
    rating: Joi.number()
      .integer()
      .min(1)
      .max(5),

    title: Joi.string()
      .trim()
      .allow("")
      .max(120),

    comment: Joi.string()
      .trim()
      .min(3)
      .max(2000),

    images: Joi.array().items(imageSchema),
  }),
};

// =====================================
// Product Reviews Query
// =====================================

export const productReviewQueryValidator = {
  params: Joi.object({
    productId: Joi.string()
      .length(24)
      .hex()
      .required(),
  }),

  query: Joi.object({
    page: Joi.number()
      .min(1)
      .default(1),

    limit: Joi.number()
      .min(1)
      .max(100)
      .default(10),

    rating: Joi.number()
      .min(1)
      .max(5),

    sort: Joi.string()
      .valid(
        "createdAt",
        "-createdAt",
        "rating",
        "-rating"
      )
      .default("-createdAt"),
  }),
};

// =====================================
// Admin Reviews Query
// =====================================

export const adminReviewQueryValidator = {
  query: Joi.object({
    page: Joi.number()
      .min(1)
      .default(1),

    limit: Joi.number()
      .min(1)
      .max(100)
      .default(10),

    approved: Joi.boolean(),

    search: Joi.string()
      .allow(""),
  }),
};

// =====================================
// Review Id
// =====================================

export const reviewIdSchema = {
  params: Joi.object({
    reviewId: Joi.string()
      .length(24)
      .hex()
      .required(),
  }),
};

// =====================================
// Update Approval
// =====================================

export const updateApprovalValidator = {
  params: Joi.object({
    reviewId: Joi.string()
      .length(24)
      .hex()
      .required(),
  }),

  body: Joi.object({
    isApproved: Joi.boolean().required(),
  }),
};