import Joi from "joi";

const categoryFields = {
  name: Joi.string()
    .trim()
    .min(2)
    .max(80),

  description: Joi.string()
    .trim()
    .max(1000),

  featured: Joi.boolean(),

  isActive: Joi.boolean(),

  displayOrder: Joi.number()
    .integer()
    .min(0),

  parentCategory: Joi.string()
    .length(24)
    .hex()
    .allow(null, ""),

  icon: Joi.string()
    .trim()
    .max(200),

  metaTitle: Joi.string()
    .trim()
    .max(70),

  metaDescription: Joi.string()
    .trim()
    .max(160),

  metaKeywords: Joi.alternatives().try(
    Joi.array().items(
      Joi.string().trim().max(100)
    ),
    Joi.string().trim()
  ),
};

export const createCategorySchema = {
  body: Joi.object({
    ...categoryFields,
    name: categoryFields.name.required(),
  }),
};

export const updateCategorySchema = {
  body: Joi.object(categoryFields).min(1),

  params: Joi.object({
    id: Joi.string()
      .length(24)
      .hex()
      .required(),
  }),
};

export const categoryIdSchema = {
  params: Joi.object({
    id: Joi.string()
      .length(24)
      .hex()
      .required(),
  }),
};

export const displayOrderSchema = {
  params: Joi.object({
    id: Joi.string()
      .length(24)
      .hex()
      .required(),
  }),

  body: Joi.object({
    displayOrder: Joi.number()
      .integer()
      .min(0)
      .required(),
  }),
};

export const reorderCategoriesSchema = {
  body: Joi.object({
    categories: Joi.array()
      .items(
        Joi.object({
          id: Joi.string()
            .length(24)
            .hex()
            .required(),

          displayOrder: Joi.number()
            .integer()
            .min(0)
            .required(),
        })
      )
      .min(1)
      .required(),
  }),
};