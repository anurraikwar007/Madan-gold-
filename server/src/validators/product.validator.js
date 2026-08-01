import Joi from "joi";

// =====================================
// Image Schema
// =====================================

const imageSchema = Joi.object({
  public_id: Joi.string().required(),
  url: Joi.string().uri().required(),
  alt: Joi.string().allow("").default(""),
  isPrimary: Joi.boolean().default(false),
});

// =====================================
// Inventory Schema
// =====================================

const inventorySchema = Joi.object({
  stock: Joi.number().min(0).required(),
  reservedStock: Joi.number().min(0).default(0),
  availableStock: Joi.number().min(0).default(0),
  lowStockThreshold: Joi.number().min(0).default(5),
});

// =====================================
// Create Product
// =====================================

export const createProductSchema = {
  body: Joi.object({

    name: Joi.string().trim().min(3).max(150).required(),

    description: Joi.string().trim().required(),

    shortDescription: Joi.string().allow("").default(""),

    category: Joi.string().required(),

    metal: Joi.string()
      .valid("Gold", "Silver", "Platinum")
      .required(),

    purity: Joi.string()
      .valid(
        "14K",
        "18K",
        "22K",
        "24K",
        "925 Silver",
        "950 Platinum"
      )
      .required(),

    gender: Joi.string()
      .valid("Men", "Women", "Kids", "Unisex")
      .default("Unisex"),

    weight: Joi.number().positive().required(),

    price: Joi.number().positive().required(),

    discountPrice: Joi.number().min(0).default(0),

    makingCharges: Joi.number().min(0).default(0),

    gst: Joi.number().min(0).default(3),

    featured: Joi.boolean().default(false),

    bestseller: Joi.boolean().default(false),

    isActive: Joi.boolean().default(true),

    inventory: inventorySchema.required(),

    images: Joi.array()
      .items(imageSchema)
      .default([]),

    seoTitle: Joi.string().allow("").default(""),

    seoDescription: Joi.string().allow("").default(""),

    seoKeywords: Joi.array()
      .items(Joi.string())
      .default([]),

  }),
};

// =====================================
// Update Product
// =====================================

export const updateProductSchema = {
  body: Joi.object({

    name: Joi.string().trim().min(3).max(150),

    description: Joi.string(),

    shortDescription: Joi.string(),

    category: Joi.string(),

    metal: Joi.string().valid(
      "Gold",
      "Silver",
      "Platinum"
    ),

    purity: Joi.string().valid(
      "14K",
      "18K",
      "22K",
      "24K",
      "925 Silver",
      "950 Platinum"
    ),

    gender: Joi.string().valid(
      "Men",
      "Women",
      "Kids",
      "Unisex"
    ),

    weight: Joi.number().positive(),

    price: Joi.number().positive(),

    discountPrice: Joi.number().min(0),

    makingCharges: Joi.number().min(0),

    gst: Joi.number().min(0),

    featured: Joi.boolean(),

    bestseller: Joi.boolean(),

    isActive: Joi.boolean(),

    inventory: inventorySchema,

    images: Joi.array().items(imageSchema),

    seoTitle: Joi.string(),

    seoDescription: Joi.string(),

    seoKeywords: Joi.array().items(Joi.string()),

  }),
};

// =====================================
// Product Id
// =====================================

export const productIdSchema = {
  params: Joi.object({
    id: Joi.string().length(24).hex().required(),
  }),
};