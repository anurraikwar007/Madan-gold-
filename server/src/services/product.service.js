import ProductRepository from "../repositories/product.repository.js";
import AuditService from "./audit.service.js";

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

      limit = 10,

      search = "",

      category,

      metal,

      purity,

      gender,

      featured,

      bestseller,

      minPrice,

      maxPrice,

      sort = "newest",

    }) => {

      const filter = {

        isDeleted: false,

        isActive: true,

      };

      // =====================================
      // Search
      // =====================================

      if (search) {

        filter.$text = {

          $search: search,

        };

      }

      // =====================================
      // Filters
      // =====================================

      if (category)
        filter.category = category;

      if (metal)
        filter.metal = metal;

      if (purity)
        filter.purity = purity;

      if (gender)
        filter.gender = gender;

      if (featured !== undefined)
        filter.featured = featured;

      if (bestseller !== undefined)
        filter.bestseller = bestseller;
        // =====================================
      // Price Filter
      // =====================================

      if (minPrice || maxPrice) {

        filter.price = {};

        if (minPrice) {
          filter.price.$gte = Number(minPrice);
        }

        if (maxPrice) {
          filter.price.$lte = Number(maxPrice);
        }

      }

      // =====================================
      // Sorting
      // =====================================

      let sortOption = {
        createdAt: -1,
      };

      switch (sort) {

        case "price_low":

          sortOption = {
            price: 1,
          };

          break;

        case "price_high":

          sortOption = {
            price: -1,
          };

          break;

        case "rating":

          sortOption = {
            averageRating: -1,
          };

          break;

        case "popular":

          sortOption = {
            totalReviews: -1,
          };

          break;

        default:

          sortOption = {
            createdAt: -1,
          };

      }

      // =====================================
      // Pagination
      // =====================================

      const skip =
        (page - 1) * limit;

      const [
        products,
        totalProducts,
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

          total: totalProducts,

          page: Number(page),

          limit: Number(limit),

          totalPages: Math.ceil(
            totalProducts / limit
          ),

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

  const filter = {};

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
    filter.$text = {
      $search: search,
    };
  }

  if (category) {
    filter.category = category;
  }

  if (metal) {
    filter.metal = metal;
  }

  if (purity) {
    filter.purity = purity;
  }

  if (gender) {
    filter.gender = gender;
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
    filter.price = {};

    if (minPrice !== undefined) {
      filter.price.$gte = Number(minPrice);
    }

    if (maxPrice !== undefined) {
      filter.price.$lte = Number(maxPrice);
    }
  }

  let sortOption = {
    createdAt: -1,
  };

  switch (sort) {
    case "price_low":
      sortOption = {
        price: 1,
      };
      break;

    case "price_high":
      sortOption = {
        price: -1,
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

      product.inventory.stock =
      dto.inventory.stock ??
      product.inventory.stock;

      product.inventory.reservedStock =
      dto.inventory.reservedStock ??
      product.inventory.reservedStock;

      product.inventory.lowStockThreshold =
      dto.inventory.lowStockThreshold ??
      product.inventory.lowStockThreshold;

      product.inventory.availableStock =
      Math.max(

        product.inventory.stock -

        product.inventory.reservedStock,

        0

      );

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

export const getFeaturedProducts =
async (
  limit = 10
) => {

  return await ProductRepository.find(

    {

      featured: true,

      isDeleted: false,

      isActive: true,

    },

    {

      sort: {
        createdAt: -1,
      },

      limit,

    }

  );

};
// ======================================================
// Bestseller Products
// ======================================================

export const getBestSellerProducts =
async (
  limit = 10
) => {

  return await ProductRepository.find(

    {

      bestseller: true,

      isDeleted: false,

      isActive: true,

    },

    {

      sort: {

        averageRating: -1,

        totalReviews: -1,

      },

      limit,

    }

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

  if (!keyword) return [];

  return ProductRepository.searchSuggestions(keyword);

};