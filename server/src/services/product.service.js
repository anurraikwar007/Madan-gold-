import ProductRepository from "../repositories/product.repository.js";
import AuditService from "./audit.service.js";
import ApiError from "../utils/apiError.js";
import { ProductDTO } from "../dto/product.dto.js";
import { getObjectDiff } from "../utils/diff.util.js";

// ======================================================
// Create Product
// ======================================================

export const createProduct = async (
  payload,
  context
) => { 

  const dto =
    ProductDTO.create(payload);
     
    if (
  dto.metal !== "Silver" ||
    dto.purity !== "925 Silver"
  ) {
    throw new Error(
      "Only 925 Silver jewellery products are allowed."
    );
  }
  
  // =====================================
  // Inventory Sync
  // =====================================
   
     if (
    dto.inventory.reservedStock >
    dto.inventory.stock
    ) {
    throw new Error(
       "Reserved stock cannot exceed total stock."
    );
      }


   dto.inventory.availableStock =
    Math.max(

      dto.inventory.stock -

      dto.inventory.reservedStock,

      0

    );

  // =====================================
  // Create Product
  // =====================================

  const product =
    await ProductRepository.create(dto);
      // =====================================
  // Audit Log
  // =====================================

 try {

  await AuditService.log({

    entityType: "Product",

    entityId: product._id,

    action: "CREATE",

    performedBy: context.adminId,

    changes: [
      {
        field: "CREATE",
        oldValue: null,
        newValue: product,
      },
    ],

    ipAddress: context.ipAddress,

    userAgent: context.userAgent,

    requestId: context.requestId,

  });

} catch (error) {

  console.error("Audit Log Error:", error.message);

}

  return product.toObject();

};

// ======================================================
// Get Products
// ======================================================

 export const getAllProducts = async ({
  page = 1,
  limit = 24,
  search = "",
  category,
  gender,
  featured,
  bestseller,
  minPrice,
  maxPrice,
  sort = "newest",
} = {}) => {
  page = Math.max(
    Number(page) || 1,
    1
  );

  limit = Math.min(
    Math.max(
      Number(limit) || 24,
      1
    ),
    50
  );

  const filter = {
    isDeleted: false,
    isActive: true,
    metal: "Silver",
    purity: "925 Silver",
  };

  // ==============================
  // SEARCH
  // ==============================

  const normalizedSearch =
    String(search || "").trim();

  if (normalizedSearch) {
    const fields = [
      "name",
      "sku",
      "category",
      "description",
      "shortDescription",
      "seoTitle",
      "seoDescription",
      "seoKeywords",
    ];

    const tokens = normalizedSearch
      .split(/\s+/)
      .map((token) => token.trim())
      .filter(Boolean)
      .slice(0, 8);

    filter.$and = tokens.map((token) => {
      const escapedToken = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return {
        $or: fields.map((field) => ({
          [field]: { $regex: escapedToken, $options: "i" },
        })),
      };
    });
  }

  // ==============================
  // CATEGORY
  // ==============================

  if (category) {
    filter.category =
      String(category).trim();
  }

  // ==============================
  // GENDER
  // ==============================

  if (gender) {
    filter.gender = gender;
  }

  // ==============================
  // FEATURED
  // ==============================

  if (featured !== undefined) {
    filter.featured =
      featured === true ||
      featured === "true";
  }

  // ==============================
  // BESTSELLER
  // ==============================

  if (bestseller !== undefined) {
    filter.bestseller =
      bestseller === true ||
      bestseller === "true";
  }

  // ==============================
  // PRICE
  // ==============================

  const hasMin =
    minPrice !== undefined &&
    minPrice !== "";

  const hasMax =
    maxPrice !== undefined &&
    maxPrice !== "";

  if (hasMin || hasMax) {
    const min = hasMin
      ? Number(minPrice)
      : null;

    const max = hasMax
      ? Number(maxPrice)
      : null;

    if (
      (min !== null &&
        !Number.isFinite(min)) ||
      (max !== null &&
        !Number.isFinite(max))
    ) {
      throw new ApiError(
        400,
        "Invalid price filter."
      );
    }

    if (
      min !== null &&
      max !== null &&
      min > max
    ) {
      throw new ApiError(
        400,
        "Minimum price cannot be greater than maximum price."
      );
    }

    filter.sellingPrice = {};

    if (min !== null) {
      filter.sellingPrice.$gte =
        Math.max(min, 0);
    }

    if (max !== null) {
      filter.sellingPrice.$lte =
        Math.max(max, 0);
    }
  }

  // ==============================
  // SORT
  // ==============================

  let sortOption = {
    createdAt: -1,
    _id: -1,
  };

  switch (sort) {
    case "price_low":
      sortOption = {
        sellingPrice: 1,
        _id: 1,
      };
      break;

    case "price_high":
      sortOption = {
        sellingPrice: -1,
        _id: -1,
      };
      break;

    case "rating":
      sortOption = {
        averageRating: -1,
        totalReviews: -1,
        _id: -1,
      };
      break;

    case "popular":
      sortOption = {
        totalReviews: -1,
        averageRating: -1,
        _id: -1,
      };
      break;

    case "newest":
    default:
      sortOption = {
        createdAt: -1,
        _id: -1,
      };
      break;
  }

  // ==============================
  // DATABASE QUERY
  // ==============================

  const skip =
    (page - 1) * limit;

  const [products, totalProducts] =
    await Promise.all([
      ProductRepository.find(
        filter,
        {
          skip,
          limit,
          sort: sortOption,
          select: "-__v",
          lean: true,
        }
      ),

      ProductRepository.count(filter),
    ]);

  const totalPages =
    Math.ceil(
      totalProducts / limit
    );

  return {
    products,

    pagination: {
      total: totalProducts,
      page,
      limit,
      totalPages,

      hasNextPage:
        page < totalPages,

      hasPrevPage:
        page > 1,
    },
  };
};

 //======================================================
//  Get Admin Products
// ======================================================

  export const getAdminProducts = async ({
  page = 1,
  limit = 10,
  search = "",
  category,
  metal,
  purity,
  gender,
  featured,
  bestseller,
  isActive,
  isDeleted,
  minPrice,
  maxPrice,
  sort = "newest",
}) => {
  page = Math.max(Number(page) || 1, 1);
  limit = Math.min(
    Math.max(Number(limit) || 10, 1),
    100
  );

  const filter = {
  metal: "Silver",
  purity: "925 Silver",
};
  // Deleted filter
  if (isDeleted !== undefined) {
    filter.isDeleted =
      isDeleted === true ||
      isDeleted === "true";
  } else {
    filter.isDeleted = false;
  }

  // Active filter
  if (isActive !== undefined) {
    filter.isActive =
      isActive === true ||
      isActive === "true";
  }

  // Search
  if (search) {
    const fields = [
      "name",
      "sku",
      "category",
      "description",
      "shortDescription",
      "seoTitle",
      "seoDescription",
      "seoKeywords",
    ];
    const tokens = String(search)
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 8);

    filter.$and = tokens.map((token) => {
      const escapedToken = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return {
        $or: fields.map((field) => ({
          [field]: { $regex: escapedToken, $options: "i" },
        })),
      };
    });
  }

  if (category) {
    filter.category = category;
  }

 

  if (gender) {
  const genderMap = {
    men: "Men",
    women: "Women",
    kids: "Kids",
    unisex: "Unisex",
  };

  filter.gender =
    genderMap[
      String(gender).toLowerCase()
    ] || gender;
}

  if (featured !== undefined) {
    filter.featured =
      featured === true ||
      featured === "true";
  }

  if (bestseller !== undefined) {
    filter.bestseller =
      bestseller === true ||
      bestseller === "true";
  }

  // Price
 if (
  minPrice !== undefined ||
  maxPrice !== undefined
) {
  const min =
    minPrice !== undefined
      ? Number(minPrice)
      : null;

  const max =
    maxPrice !== undefined
      ? Number(maxPrice)
      : null;

  if (
    (min !== null && !Number.isFinite(min)) ||
    (max !== null && !Number.isFinite(max))
  ) {
    throw new ApiError(
      400,
      "Invalid price filter."
    );
  }

  filter.sellingPrice = {};

  if (min !== null) {
    filter.sellingPrice.$gte =
      Math.max(min, 0);
  }

  if (max !== null) {
    filter.sellingPrice.$lte =
      Math.max(max, 0);
  }
}

  let sortOption = {
    createdAt: -1,
  };

  switch (sort) {
   case "price_low":
  sortOption = {
    sellingPrice: 1,
    _id: 1,
  };
  break;

case "price_high":
  sortOption = {
    sellingPrice: -1,
    _id: -1,
  };
  break;

    case "rating":
      sortOption = {
        averageRating: -1,
      };
      break;

    case "stock_low":
      sortOption = {
        "inventory.availableStock": 1,
      };
      break;

    case "stock_high":
      sortOption = {
        "inventory.availableStock": -1,
      };
      break;

    case "oldest":
      sortOption = {
        createdAt: 1,
      };
      break;

    default:
      sortOption = {
        createdAt: -1,
      };
  }

  const skip =
    (page - 1) * limit;

  const [
    products,
    total,
  ] = await Promise.all([
    ProductRepository.find(
      filter,
      {
        skip,
        limit,
        sort: sortOption,
      }
    ),

    ProductRepository.count(filter),
  ]);

  return {
    products,

    pagination: {
      total,
      page,
      limit,
      totalPages:
        Math.ceil(total / limit),

      hasNextPage:
        page <
        Math.ceil(total / limit),

      hasPrevPage:
        page > 1,
    },
  };
};

// ======================================================
// Get Product By Id
// ======================================================

export const getProductById =
async (productId) => {

  const product =
    await ProductRepository.findById(
      productId,
      {
      lean: false,
    }
    );

  if (
    !product ||
    product.isDeleted
  ) {

    throw new Error(
      "Product not found."
    );

  }

  return product;

};

// ======================================================
// Update Product
// ======================================================

export const updateProduct =
async (
  productId,
  payload,
  context
) => {

 const dto =
  ProductDTO.update(payload);

const product =
  await ProductRepository.findById(
    productId,
    {
      lean: false,
    }
  );

if (
  !product ||
  product.isDeleted
) {
  throw new Error(
    "Product not found."
  );
}

const nextMetal =
  dto.metal ?? product.metal;

const nextPurity =
  dto.purity ?? product.purity;

if (
  nextMetal !== "Silver" ||
  nextPurity !== "925 Silver"
) {
  throw new Error(
    "Only 925 Silver jewellery products are allowed."
  );
}


  const oldProduct =
    product.toObject();
      

     if (dto.sku && dto.sku !== product.sku) {

  const existingSKU =
    await ProductRepository.findOne({
      _id: { $ne: productId },
      sku: dto.sku,
    });

  if (existingSKU) {
    throw new Error("SKU already exists.");
  }

}

  // =====================================
  // Merge Payload
  // =====================================

  Object.assign(
    product,
    dto
  );

  // =====================================
  // Inventory Sync
  // =====================================

  if (dto.inventory) {
  const nextStock =
    dto.inventory.stock ??
    product.inventory.stock;

  const nextReservedStock =
    dto.inventory.reservedStock ??
    product.inventory.reservedStock;

  if (nextReservedStock > nextStock) {
    throw new ApiError(
      400,
      "Reserved stock cannot exceed total stock."
     );
   }

   product.inventory.stock =
    nextStock;

   product.inventory.reservedStock =
    nextReservedStock;

   product.inventory.lowStockThreshold =
    dto.inventory.lowStockThreshold ??
    product.inventory.lowStockThreshold;

   product.inventory.availableStock =
    nextStock -
    nextReservedStock;
 }

  // =====================================
  // Save Product
  // =====================================

  await product.save();

  // =====================================
  // Detect Changes
  // =====================================

  const changes =
    getObjectDiff(

      oldProduct,

      product.toObject()

    );

  // =====================================
  // Audit Log
  // =====================================

  try {

  await AuditService.log({

    entityType: "Product",

    entityId: product._id,

    action: "UPDATE",

    performedBy: context.adminId,

    changes,

    ipAddress: context.ipAddress,

    userAgent: context.userAgent,

    requestId: context.requestId,

  });

} catch (error) {

  console.error("Audit Error:", error.message);

}

  return product.toObject();

};

// ======================================================
// Soft Delete Product
// ======================================================

export const deleteProduct =
async (
  productId,
  context
) => {

  const product =
    await ProductRepository.findById(
      productId,
      {
      lean: false,
    }
    );

  if (
    !product ||
    product.isDeleted
  ) {

    throw new Error(
      "Product not found."
    );

  }

  product.isDeleted = true;

  product.isActive = false;

  await product.save();

  await AuditService.log({

    entityType: "Product",

    entityId: product._id,

    action: "DELETE",

    performedBy:
      context.adminId,

    changes: [],

    ipAddress:
      context.ipAddress,

    userAgent:
      context.userAgent,

    requestId:
      context.requestId,

  });

  return true;

};

// ======================================================
// Restore Product
// ======================================================

export const restoreProduct =
async (
  productId,
  context
) => {

  const product =
    await ProductRepository.findOne({

      _id: productId,

      isDeleted: true,

    },
    {
        lean:false
    }
  );

  if (!product) {

    throw new Error(
      "Product not found."
    );

  }

  product.isDeleted = false;

  product.isActive = true;

  await product.save();
    // =====================================
  // Audit Log
  // =====================================

 try {

  await AuditService.log({

    entityType: "Product",

    entityId: product._id,

    action: "RESTORE",

    performedBy: context.adminId,

    changes: [],

    ipAddress: context.ipAddress,

    userAgent: context.userAgent,

    requestId: context.requestId,

  });

} catch (error) {

  console.error("Audit Error:", error.message);

}

  return product.toObject();

};

// ======================================================
// Toggle Product Status
// ======================================================

export const toggleProductStatus =
async (
  productId,
  context
) => {

  const product =
    await ProductRepository.findById(
      productId,
      {
      lean: false,
    }
    );

  if (
    !product ||
    product.isDeleted
  ) {

    throw new Error(
      "Product not found."
    );

  }

  const oldProduct =
    product.toObject();

  product.isActive =
    !product.isActive;

  await product.save();

  const changes =
    getObjectDiff(
      oldProduct,
      product.toObject()
    );

  try {

  await AuditService.log({

    entityType: "Product",

    entityId: product._id,

    action: "STATUS_CHANGE",

    performedBy: context.adminId,

    changes,

    ipAddress: context.ipAddress,

    userAgent: context.userAgent,

    requestId: context.requestId,

  });

} catch (error) {

  console.error("Audit Error:", error.message);

}

  return product.toObject();

};

// ======================================================
// Update Inventory
// ======================================================

export const updateInventory =
async (
  productId,
  inventory,
  context
) => {

  const product =
    await ProductRepository.findById(
      productId,
      {
      lean: false,
    }
    );

  if (
    !product ||
    product.isDeleted
  ) {

    throw new Error(
      "Product not found."
    );

  }

  const oldProduct =
    product.toObject();

  // =====================================
  // Inventory Update
  // =====================================
     
    const newStock =
    inventory.stock ??
    product.inventory.stock;

    const newReserved =
    inventory.reservedStock ??
    product.inventory.reservedStock;

   if (newReserved > newStock) {
    throw new Error(
        "Reserved stock cannot exceed total stock."
       );
     }
      product.inventory.stock = newStock;

      product.inventory.reservedStock = newReserved;
      
      product.inventory.availableStock =
       newStock - newReserved;

  await product.save();

  const changes =
    getObjectDiff(
      oldProduct,
      product.toObject()
    );

 try {

  await AuditService.log({

    entityType: "Product",

    entityId: product._id,

    action: "UPDATE",

    performedBy: context.adminId,

    changes,

    ipAddress: context.ipAddress,

    userAgent: context.userAgent,

    requestId: context.requestId,

  });

} catch (error) {

  console.error("Audit Error:", error.message);

}

  return product.toObject();

};    
   

// ======================================================
// Featured Products
// ======================================================

 export const getFeaturedProducts = async (
  limit = 10
  ) => {
  const safeLimit = Math.min(
    Math.max(Number(limit) || 10, 1),
    50
  );

  return ProductRepository.getFeatured(
    safeLimit
    );
 };
// ======================================================
// Bestseller Products
// ======================================================

 export const getBestSellerProducts = async (
  limit = 10
  ) => {
  const safeLimit = Math.min(
    Math.max(Number(limit) || 10, 1),
    50
  );

  return ProductRepository.getBestSeller(
    safeLimit
   );
 };

// ======================================================
// Low Stock Products
// ======================================================

export const getLowStockProducts =
async () => {

  return await ProductRepository.aggregate([

    {

      $match: {

        isDeleted: false,

        isActive: true,

      },

    },

    {

      $match: {

        $expr: {

          $lte: [

            "$inventory.availableStock",

            "$inventory.lowStockThreshold",

          ],

        },

      },

    },

    {

      $sort: {

        "inventory.availableStock": 1,

      },

    },

  ]);

};

// ======================================================
// Out Of Stock Products
// ======================================================

export const getOutOfStockProducts =
async () => {

  return await ProductRepository.find(

    {

      isDeleted: false,

      isActive: true,

      "inventory.availableStock": 0,

    },

    {

      sort: {

        updatedAt: -1,

      },

    }

  );

};

// ======================================================
// Product Statistics
// ======================================================

export const getProductStatistics =
async () => {

  const [

    totalProducts,

    activeProducts,

    featuredProducts,

    bestsellerProducts,

    lowStockProducts,

    outOfStockProducts,

  ] = await Promise.all([

    ProductRepository.count({

      isDeleted: false,

    }),

    ProductRepository.count({

      isDeleted: false,

      isActive: true,

    }),

    ProductRepository.count({

      featured: true,

      isDeleted: false,

    }),

    ProductRepository.count({

      bestseller: true,

      isDeleted: false,

    }),

    ProductRepository.count({

      isDeleted: false,

      isActive: true,

      $expr: {

        $lte: [

          "$inventory.availableStock",

          "$inventory.lowStockThreshold",

        ],

      },

    }),

    ProductRepository.count({

      isDeleted: false,

      isActive: true,

      "inventory.availableStock": 0,

    }),

  ]);

  return {

    totalProducts,

    activeProducts,

    featuredProducts,

    bestsellerProducts,

    lowStockProducts,

    outOfStockProducts,

  };

};
// ======================================================
// Bulk Activate Products
// ======================================================

export const bulkActivateProducts =
async (
  productIds,
  context
) => {

  const result =
  await ProductRepository.updateMany(
    {
      _id: {
        $in: productIds,
      },
      metal: "Silver",
      purity: "925 Silver",
      isDeleted: false,
    },
    {
      $set: {
        isActive: true,
      },
    }
  );

 try {

  await AuditService.log({

    entityType: "Product",

    entityId: null,

    action: "STATUS_CHANGE",

    performedBy: context.adminId,

    changes: [
      {
        field: "bulkActivate",
        oldValue: null,
        newValue: productIds,
      },
    ],

    ipAddress: context.ipAddress,

    userAgent: context.userAgent,

    requestId: context.requestId,

  });

} catch (error) {

  console.error("Audit Error:", error.message);

}

  return result;

};

// ======================================================
// Bulk Deactivate Products
// ======================================================

export const bulkDeactivateProducts =
async (
  productIds,
  context
) => {

  const result =
  await ProductRepository.updateMany(
    {
      _id: {
        $in: productIds,
      },
      metal: "Silver",
      purity: "925 Silver",
      isDeleted: false,
    },
    {
      $set: {
        isActive: false,
      },
    }
  );
 try {

  await AuditService.log({

    entityType: "Product",

    entityId: null,

    action: "STATUS_CHANGE",

    performedBy: context.adminId,

    changes: [
      {
        field: "bulkDeactivate",
        oldValue: null,
        newValue: productIds,
      },
    ],

    ipAddress: context.ipAddress,

    userAgent: context.userAgent,

    requestId: context.requestId,

  });

} catch (error) {

    console.error("Audit Error:", error.message);

}

  return result;

};

// ======================================================
// Bulk Delete Products
// ======================================================

export const bulkDeleteProducts =
async (
  productIds,
  context
) => {

  const result =
  await ProductRepository.updateMany(
    {
      _id: {
        $in: productIds,
      },
      metal: "Silver",
      purity: "925 Silver",
      isDeleted: false,
    },
    {
      $set: {
        isDeleted: true,
        isActive: false,
      },
    }
  );

  try {

  await AuditService.log({

    entityType: "Product",

    entityId: null,

    action: "DELETE",

    performedBy: context.adminId,

    changes: [
      {
        field: "bulkDelete",
        oldValue: null,
        newValue: productIds,
      },
    ],

    ipAddress: context.ipAddress,

    userAgent: context.userAgent,

    requestId: context.requestId,

  });

} catch (error) {

  console.error("Audit Error:", error.message);

}

  return result;

};

// ======================================================
// Inventory Report
// ======================================================

export const getInventoryReport =
async () => {

  return await ProductRepository.find(

    {

      isDeleted: false,
      metal: "Silver",
      purity: "925 Silver",


    },

    {

      select:
        "name sku category metal purity inventory isActive",

      sort: {

        "inventory.availableStock": 1,

      },

    }

  );
    
  

};

// ======================================================
// Customer Product Details
// ======================================================

  export const getCustomerProduct = async (id) => {

    const product =
      await ProductRepository.findActiveById(id);

    if (!product) {
      throw new Error("Product not found.");
    }

    return product;

  };

  // ======================================================
  // Customer Product By Slug
 // ======================================================

 export const getCustomerProductBySlug = async (
  slug
 ) => {
  const normalizedSlug =
    String(slug || "")
      .trim()
      .toLowerCase();

  if (!normalizedSlug) {
    throw new ApiError(
      400,
      "Product slug is required."
    );
  }

  const product =
    await ProductRepository.findBySlug(
      normalizedSlug
    );

  if (!product) {
    throw new ApiError(
      404,
      "Product not found."
    );
  }

  return product;
};

// ======================================================
// Related Products
// ======================================================

export const getRelatedProducts = async (id) => {

  const product =
    await ProductRepository.findActiveById(id);

  if (!product) {
    throw new Error("Product not found.");
  }

  return ProductRepository.relatedProducts(

    product.category,

    product._id

  );

};

// ======================================================
// Search Suggestions
// ======================================================

export const searchSuggestions = async (keyword) => {
  const value = String(keyword || "")
  .trim()
  .slice(0, 100);
  
  if (!keyword) return [];

  return ProductRepository.searchSuggestions(keyword);

};