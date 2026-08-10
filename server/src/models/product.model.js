import mongoose from "mongoose";
import slugify from "slugify";
import Counter from "./counter.model.js";


// ======================================================
// Image Schema
// ======================================================

const imageSchema = new mongoose.Schema(
  {
    public_id: {
      type: String,
      required: true,
      trim: true,
    },

    url: {
      type: String,
      required: true,
      trim: true,
    },

    alt: {
      type: String,
      default: "",
      trim: true,
    },

    isPrimary: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
  }
);

// ======================================================
// Inventory Schema
// ======================================================

const inventorySchema = new mongoose.Schema(
  {
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    reservedStock: {
      type: Number,
      default: 0,
      min: 0,
    },

    availableStock: {
      type: Number,
      default: 0,
      min: 0,
    },

    lowStockThreshold: {
      type: Number,
      default: 5,
      min: 0,
    },
  },
  {
    _id: false,
  }
);

// ======================================================
// Product Schema
// ======================================================

const productSchema = new mongoose.Schema(
  {
    // =====================================
    // Basic Information
    // =====================================

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },

    sku: {
      type: String,
      unique: true,
      uppercase: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    shortDescription: {
      type: String,
      default: "",
      trim: true,
      maxlength: 250,
    },

    // =====================================
    // Category
    // =====================================

    category: {
      type: String,
      required: true,
      trim: true,
    },

    // =====================================
    // Jewellery Details
    // =====================================

    metal: {
      type: String,
      enum: [
        "Gold",
        "Silver",
        "Platinum",
      ],
      required: true,
    },

    purity: {
      type: String,
      enum: [
        "14K",
        "18K",
        "22K",
        "24K",
        "925 Silver",
        "950 Platinum",
      ],
      required: true,
    },

    gender: {
      type: String,
      enum: [
        "Men",
        "Women",
        "Kids",
        "Unisex",
      ],
      default: "Unisex",
    },

    weight: {
      type: Number,
      required: true,
      min: 0,
    },

    // =====================================
    // Pricing
    // =====================================

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    discountPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    makingCharges: {
      type: Number,
      default: 0,
      min: 0,
    },

    gst: {
      type: Number,
      default: 3,
      min: 0,
    },

    // =====================================
    // Inventory
    // =====================================

    inventory: {
      type: inventorySchema,
      default: () => ({
        stock: 0,
        reservedStock: 0,
        availableStock: 0,
        lowStockThreshold: 5,
      }),
    },

    // =====================================
    // Images
    // =====================================

    images: {
      type: [imageSchema],
      default: [],
    },

    // =====================================
    // Product Status
    // =====================================

    featured: {
      type: Boolean,
      default: false,
    },

    bestseller: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    // =====================================
    // Ratings
    // =====================================

    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    totalReviews: {
      type: Number,
      default: 0,
      min: 0,
    },

    // =====================================
    // SEO
    // =====================================

    seoTitle: {
      type: String,
      default: "",
      trim: true,
    },

    seoDescription: {
      type: String,
      default: "",
      trim: true,
    },

    seoKeywords: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);
// ======================================================
// Auto Generate Slug
// ======================================================

productSchema.pre("save", function () {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
    });
  }
});



// ======================================================
// Auto Inventory Calculation
// ======================================================

productSchema.pre("save", function () {
  this.inventory.availableStock = Math.max(
    this.inventory.stock -
    this.inventory.reservedStock,
    0
  );
});

// ======================================================
// Price Validation
// ======================================================

productSchema.pre("validate", function () {
  if (
    this.discountPrice > 0 &&
    this.discountPrice >= this.price
  ) {
    throw new Error(
      "Discount price must be less than price."
    );
  }
});

// ======================================================
// Auto SKU Generator (Production Safe)
// ======================================================

productSchema.pre("save", async function () {

  if (!this.isNew || this.sku) {
    return;
  }

  const metalPrefix = {
    Gold: "GLD",
    Silver: "SLV",
    Platinum: "PLT",
  };

  const prefix =
    metalPrefix[this.metal] || "PRD";

  const counter = await Counter.findOneAndUpdate(
  {
    name: "PRODUCT",
    date: "GLOBAL",
  },
  {
    $inc: {
      sequence: 1,
    },
  },
  {
    returnDocument: "after",
    upsert: true,
  }
);

  this.sku =
    `MG-${prefix}-${String(counter.sequence).padStart(6, "0")}`;

});


// ======================================================
// Virtual Final Price
// ======================================================

productSchema.virtual("finalPrice").get(
  function () {
    return this.discountPrice > 0
      ? this.discountPrice
      : this.price;
  }
);

// ======================================================
// Virtual Discount Percentage
// ======================================================

productSchema.virtual(
  "discountPercentage"
).get(function () {
  if (!this.discountPrice) {
    return 0;
  }

  return Math.round(
    ((this.price -
      this.discountPrice) /
      this.price) *
      100
  );
});

// ======================================================
// Query Helpers
// ======================================================

productSchema.query.active = function () {
  return this.where({
    isActive: true,
    isDeleted: false,
  });
};

productSchema.query.featured =
  function () {
    return this.where({
      featured: true,
      isActive: true,
      isDeleted: false,
    });
  };

productSchema.query.bestseller =
  function () {
    return this.where({
      bestseller: true,
      isActive: true,
      isDeleted: false,
    });
  };

// ======================================================
// Hide Deleted Products
// ======================================================

productSchema.pre(/^find/, function () {
  const filter = this.getFilter();

  // Admin restore query must be allowed
  if (filter.isDeleted === true) {
    return;
  }

  this.where({
    isDeleted: false,
  });
});

// ======================================================
// Inventory Methods
// ======================================================

productSchema.methods.reserveStock =
  function (quantity) {
    if (
      this.inventory.availableStock <
      quantity
    ) {
      return false;
    }

    this.inventory.availableStock -=
      quantity;

    this.inventory.reservedStock +=
      quantity;

    return true;
  };

    productSchema.methods.releaseStock = function (quantity) {

      this.inventory.availableStock = Math.min(
        this.inventory.stock,
        this.inventory.availableStock + quantity
      );

      this.inventory.reservedStock = Math.max(
        0,
        this.inventory.reservedStock - quantity
      );

    };

    productSchema.methods.confirmStock = function (quantity) {

    this.inventory.stock = Math.max(
      0,
      this.inventory.stock - quantity
    );

    this.inventory.reservedStock = Math.max(
      0,
      this.inventory.reservedStock - quantity
    );

  };

// ======================================================
// JSON Options
// ======================================================

productSchema.set("toJSON", {
  virtuals: true,
});

productSchema.set("toObject", {
  virtuals: true,
});
// ======================================================
// Production Optimized Indexes
// ======================================================

// Product Search

productSchema.index(
  {
    name: "text",
    description: "text",
    seoKeywords: "text",
  },
  {
    name: "product_text_search",
    weights: {
      name: 10,
      seoKeywords: 5,
      description: 2,
    },
  }
);

// Customer Listing

productSchema.index(
  {
    isActive: 1,
    category: 1,
    metal: 1,
    purity: 1,
    gender: 1,
    "inventory.availableStock": 1,
  },
  {
    name: "catalog_filter",
  }
);

// Price Sorting

productSchema.index(
{
    isActive:1,
    category:1,
    discountPrice:1,
    price:1
},
{
    name:"price_sort"
}
);

// Rating

productSchema.index(
  {
    isActive: 1,
    averageRating: -1,
    totalReviews: -1,
  },
  {
    name: "rating_sort",
  }
);

// Featured

productSchema.index(
  {
    featured: 1,
    isActive: 1,
    createdAt: -1,
  },
  {
    name: "featured_products",
  }
);

// Best Seller

productSchema.index(
  {
    bestseller: 1,
    isActive: 1,
    averageRating: -1,
  },
  {
    name: "bestseller_products",
  }
);

// New Arrivals

productSchema.index(
  {
    isActive: 1,
    createdAt: -1,
  },
  {
    name: "new_arrivals",
  }
);

// Inventory Dashboard

productSchema.index(
  {
    "inventory.availableStock": 1,
    "inventory.lowStockThreshold": 1,
  },
  {
    name: "inventory_dashboard",
  }
);

// ======================================================
// Static Methods
// ======================================================

productSchema.statics.getLowStockProducts =
async function () {

  return this.find({
    isActive: true,

    $expr: {
      $lte: [
        "$inventory.availableStock",
        "$inventory.lowStockThreshold",
      ],
    },
  });

};

productSchema.statics.getOutOfStockProducts =
async function () {

  return this.find({
    isActive: true,

    "inventory.availableStock": 0,
  });

};

// ======================================================
// Instance Methods
// ======================================================

productSchema.methods.isAvailable =
function (qty = 1) {

  return (
    this.inventory.availableStock >= qty &&
    this.isActive &&
    !this.isDeleted
  );

};

// ======================================================
// Export
// ======================================================

const Product =
  mongoose.models.Product ||
  mongoose.model(
    "Product",
    productSchema
  );

export default Product;