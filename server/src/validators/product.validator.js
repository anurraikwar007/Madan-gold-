import Joi from "joi";

// =====================================
// Create Product
// =====================================

export const createProductSchema = {
  body: Joi.object({
    name: Joi.string()
      .trim()
      .min(3)
      .max(150)
      .required(),

    slug: Joi.string()
      .trim()
      .lowercase()
      .required(),

    sku: Joi.string()
      .trim()
      .uppercase()
      .required(),

    description: Joi.string()
      .trim()
      .min(10)
      .required(),

    category: Joi.string()
      .valid(
        "Ring",
        "Necklace",
        "Pendant",
        "Bracelet",
        "Bangle",
        "Chain",
        "Mangalsutra",
        "Earrings",
        "Nose Pin",
        "Anklet",
        "Coin",
        "Other"
      )
      .required(),

    purity: Joi.string()
      .valid(
        "18K",
        "20K",
        "22K",
        "24K",
        "925 Silver"
      )
      .required(),

    weight: Joi.number()
      .positive()
      .required(),

    makingCharge: Joi.number()
      .min(0)
      .required(),

    wastage: Joi.number()
      .min(0)
      .default(0),

    price: Joi.number()
      .positive()
      .required(),

    stock: Joi.number()
      .integer()
      .min(0)
      .required(),

    images: Joi.array()
      .items(Joi.string())
      .min(1)
      .required(),

    thumbnail: Joi.string()
      .required(),

    isFeatured: Joi.boolean()
      .default(false),

    isActive: Joi.boolean()
      .default(true),

    tags: Joi.array()
      .items(Joi.string())
      .default([]),
  }),
};

// =====================================
// Update Product
// =====================================

export const updateProductSchema = {
  body: Joi.object({
    name: Joi.string()
      .trim()
      .min(3)
      .max(150),

    slug: Joi.string()
      .trim()
      .lowercase(),

    sku: Joi.string()
      .trim()
      .uppercase(),

    description: Joi.string()
      .trim()
      .min(10),

    category: Joi.string().valid(
      "Ring",
      "Necklace",
      "Pendant",
      "Bracelet",
      "Bangle",
      "Chain",
      "Mangalsutra",
      "Earrings",
      "Nose Pin",
      "Anklet",
      "Coin",
      "Other"
    ),

    purity: Joi.string().valid(
      "18K",
      "20K",
      "22K",
      "24K",
      "925 Silver"
    ),

    weight: Joi.number().positive(),

    makingCharge: Joi.number().min(0),

    wastage: Joi.number().min(0),

    price: Joi.number().positive(),

    stock: Joi.number().integer().min(0),

    images: Joi.array().items(Joi.string()),

    thumbnail: Joi.string(),

    isFeatured: Joi.boolean(),

    isActive: Joi.boolean(),

    tags: Joi.array().items(Joi.string()),
  }),
};

// =====================================
// Product ID
// =====================================

export const productIdSchema = {
  params: Joi.object({
    id: Joi.string()
      .length(24)
      .hex()
      .required(),
  }),
};