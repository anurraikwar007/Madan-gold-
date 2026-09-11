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
  stock: Joi.number()
    .integer()
    .min(0)
    .required(),

  reservedStock: Joi.number()
    .integer()
    .min(0)
    .default(0),

  lowStockThreshold: Joi.number()
    .integer()
    .min(0)
    .default(5),
});
 
 // =====================================
// Update Inventory Schema
// =====================================

 const updateInventorySchema = Joi.object({
  stock: Joi.number()
    .integer()
    .min(0),

  reservedStock: Joi.number()
    .integer()
    .min(0),

  lowStockThreshold: Joi.number()
    .integer()
    .min(0),
}).min(1);

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
    .valid("Silver")
    .required(),

    purity: Joi.string()
      .valid("925 Silver")
      .required(),

    gender: Joi.string()
      .valid("Men", "Women", "Kids", "Unisex")
      .default("Unisex"),

    weight: Joi.number().positive().required(),

    price: Joi.number().positive().required(),

    discountPrice: Joi.number()
  .min(0)
  .default(0)
  .custom((value, helpers) => {
    const price =
      Number(
        helpers.state.ancestors[0].price
      );

      if (
        value > 0 &&
        value >= price
      ) {
        return helpers.error(
          "any.invalid"
        );
      }

      return value;
    })
    .messages({
      "any.invalid":
        "Discount price must be less than price.",
    }),

    makingCharges: Joi.number().min(0).default(0),

    gst: Joi.number().min(0).max(100).default(3),
    
    featured: Joi.boolean().default(false),

    bestseller: Joi.boolean().default(false),

    isActive: Joi.boolean().default(true),

    inventory: inventorySchema.required(),

   images: Joi.array()
    .items(imageSchema)
    .min(1)
    .max(10)
    .required()
    .messages({
      "array.min": "At least one product image is required.",
      "any.required": "At least one product image is required.",
    }),

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
      "Silver"
    ),

    purity: Joi.string().valid(
      "925 Silver"
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

    gst: Joi.number().min(0).max(100),

    featured: Joi.boolean(),

    bestseller: Joi.boolean(),

    isActive: Joi.boolean(),

   inventory: updateInventorySchema,

    images: Joi.array().items(imageSchema),

    seoTitle: Joi.string(),

    seoDescription: Joi.string(),

    seoKeywords: Joi.array().items(Joi.string()),

  }),
};  
   
  // =====================================
// Public Product Query
// =====================================

export const getProductsQuerySchema = {
  query: Joi.object({
    page: Joi.number()
      .integer()
      .min(1)
      .default(1),

    limit: Joi.number()
      .integer()
      .min(1)
      .max(100)
      .default(24),

    search: Joi.string()
      .trim()
      .max(100)
      .allow("")
      .default(""),

    category: Joi.string()
      .trim()
      .max(100),

    gender: Joi.string()
      .valid(
        "Men",
        "Women",
        "Kids",
        "Unisex"
      ),

        featured: Joi.boolean(),

        bestseller: Joi.boolean(),

        minPrice: Joi.number()
          .min(0),

        maxPrice: Joi.number()
          .min(0),

        sort: Joi.string()
          .valid(
            "newest",
            "price_low",
            "price_high",
            "rating",
            "popular"
          )
          .default("newest"),
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