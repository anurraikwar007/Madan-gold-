import BaseRepository from "./base.repository.js";
import Product from "../models/product.model.js";

class ProductRepository extends BaseRepository {
  constructor() {
    super(Product);
  }
   


  // =====================================================
  // Find By ID (Active)
  // =====================================================

  async findActiveById(productId) {
  return this.findOne({
    _id: productId,
    isDeleted: false,
    isActive: true,
    metal: "Silver",
    purity: "925 Silver",
  });
}

  // =====================================================
  // Find By Slug
  // =====================================================

  async findBySlug(slug) {
    return this.findOne({
      slug,
      isDeleted: false,
      isActive: true,
      metal: "Silver",
      purity: "925 Silver",
    });
  }

  // =====================================================
  // Find By SKU
  // =====================================================

  async findBySKU(sku) {
    return this.findOne({
      sku,
      isDeleted: false,
    });
  }

  // =====================================================
  // Duplicate Product Check
  // =====================================================

  async findDuplicate({
    name,
    metal,
    purity,
    weight,
    excludeId = null,
  }) {
    const filter = {
      name,
      metal,
      purity,
      weight,
      isDeleted: false,
    };

    if (excludeId) {
      filter._id = {
        $ne: excludeId,
      };
    }

    return this.findOne(filter);
  }

  // =====================================================
  // Customer Catalog
  // =====================================================

 async getCatalog({
  filter = {},
  page = 1,
  limit = 10,
  sort = {
    createdAt: -1,
    _id: -1,
  },
}) {
  return this.paginate(filter, {
    page,
    limit,
    sort,
    select: "-__v",
    lean: true,
  });
}

  // =====================================================
  // Featured Products
  // =====================================================

  async getFeatured(limit = 10) {
  return Product.find({
    featured: true,
    isDeleted: false,
    isActive: true,
    metal: "Silver",
    purity: "925 Silver",
  })
    .sort({
      createdAt: -1,
      _id: -1,
    })
    .limit(Math.min(Number(limit) || 10, 50))
    .lean();
}
    // =====================================================
  // Bestseller Products
  // =====================================================

  async getBestSeller(limit = 10) {
  return Product.find({
    bestseller: true,
    isDeleted: false,
    isActive: true,
    metal: "Silver",
    purity: "925 Silver",
  })
    .sort({
      averageRating: -1,
      totalReviews: -1,
      createdAt: -1,
      _id: -1,
    })
    .limit(Math.min(Number(limit) || 10, 50))
    .lean();
}
  // =====================================================
  // Low Stock Products
  // =====================================================

   async getLowStock() {
    return Product.find({
    isDeleted: false,
    isActive: true,
    metal: "Silver",
    purity: "925 Silver",

    $expr: {
      $lte: [
        "$inventory.availableStock",
        "$inventory.lowStockThreshold",
      ],
    },
  })
    .sort({
      "inventory.availableStock": 1,
      _id: 1,
    })
    .lean();
}

   // =====================================================
  // Related Products
  // =====================================================

  async relatedProducts(category, excludeId, limit = 8) {
  return this.model
    .find({
      category,
      _id: { $ne: excludeId },
      metal: "Silver",
      purity: "925 Silver",
      isDeleted: false,
      isActive: true,
    })
    .sort({
      bestseller: -1,
      averageRating: -1,
      totalReviews: -1,
      createdAt: -1,
      _id: -1,
    })
    .limit(Math.min(Number(limit) || 8, 20))
    .lean();
}

// =====================================================
// Search Suggestions
// =====================================================

    async searchSuggestions(keyword) {
  const value = String(keyword || "").trim();

  if (!value) {
    return [];
  }

  const escaped = value.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );

  return this.model
    .find({
      name: {
        $regex: escaped,
        $options: "i",
      },

      metal: "Silver",
      purity: "925 Silver",

      isDeleted: false,
      isActive: true,
    })
    .select("name slug images")
    .sort({
      bestseller: -1,
      averageRating: -1,
      totalReviews: -1,
    })
    .limit(10)
    .lean();
}

  // =====================================================
  // Out Of Stock Products
  // =====================================================

  async getOutOfStock() {
  return Product.find({
    isDeleted: false,
    isActive: true,
    metal: "Silver",
    purity: "925 Silver",

    "inventory.availableStock": 0,
  })
    .sort({
      createdAt: -1,
      _id: -1,
    })
    .lean();
}

  // =====================================================
  // Reserve Inventory (Atomic)
  // =====================================================

async confirmInventory(
  productId,
  quantity,
  session = null
) {
  const safeQuantity = Math.max(
    Number(quantity) || 0,
    0
  );

  if (!safeQuantity) {
    return null;
  }

  return Product.findOneAndUpdate(
    {
      _id: productId,
      isDeleted: false,
      "inventory.reservedStock": {
        $gte: safeQuantity,
      },
    },
    {
      $inc: {
        "inventory.stock": -safeQuantity,
        "inventory.reservedStock": -safeQuantity,
      },
    },
    {
      returnDocument: "after",
      session,
      runValidators: true,
    }
  );
}
    // =====================================================
  // Restore Inventory (Cancelled Order)
  // =====================================================

  async restoreInventory(
    productId,
    quantity,
    session = null
  ) {
    return Product.findOneAndUpdate(
      {
        _id: productId,
        isDeleted: false,
      },
      {
        $inc: {
          "inventory.stock": quantity,
          "inventory.availableStock": quantity,
        },
      },
      {
         returnDocument: "after",
        session,
      }
    );
  }

  // =====================================================
  // Update Inventory
  // =====================================================

  async updateInventory(
    productId,
    inventory,
    session = null
  ) {
    const update = {};

    if (inventory.stock !== undefined) {
      update["inventory.stock"] = inventory.stock;
    }

    if (
      inventory.reservedStock !== undefined
    ) {
      update["inventory.reservedStock"] =
        inventory.reservedStock;
    }

    if (
      inventory.lowStockThreshold !==
      undefined
    ) {
      update[
        "inventory.lowStockThreshold"
      ] =
        inventory.lowStockThreshold;
    }

    if (
      inventory.stock !== undefined ||
      inventory.reservedStock !==
        undefined
    ) {
      const stock =
        inventory.stock ?? 0;

      const reserved =
        inventory.reservedStock ?? 0;

      update[
        "inventory.availableStock"
      ] = Math.max(
        stock - reserved,
        0
      );
    }

    return Product.findByIdAndUpdate(
      productId,
      {
        $set: update,
      },
      {
         returnDocument: "after",
        session,
      }
    );
  }

  // =====================================================
  // Bulk Activate
  // =====================================================

  async bulkActivate(ids) {
    return Product.updateMany(
      {
        _id: {
          $in: ids,
        },
      },
      {
        $set: {
          isActive: true,
        },
      }
    );
  }

  // =====================================================
  // Bulk Deactivate
  // =====================================================

  async bulkDeactivate(ids) {
    return Product.updateMany(
      {
        _id: {
          $in: ids,
        },
      },
      {
        $set: {
          isActive: false,
        },
      }
    );
  }

  // =====================================================
  // Bulk Soft Delete
  // =====================================================

  async bulkDelete(ids) {
    return Product.updateMany(
      {
        _id: {
          $in: ids,
        },
      },
      {
        $set: {
          isDeleted: true,
          isActive: false,
        },
      }
    );
  }

  // =====================================================
  // Inventory Report
  // =====================================================

  async getInventoryReport() {
    return Product.find({
      isDeleted: false,
      metal: "Silver",
      purity: "925 Silver",
    })
      .select(
        `
        name
        sku
        category
        metal
        purity
        inventory
        `
      )
      .sort({
        "inventory.availableStock": 1,
      })
      .lean();
  }

  // =====================================================
  // Dashboard Statistics
  // =====================================================

  async getStatistics() {
    const [
      totalProducts,
      activeProducts,
      inactiveProducts,
      featuredProducts,
      bestsellerProducts,
      lowStockProducts,
      outOfStockProducts,
    ] = await Promise.all([
      Product.countDocuments({
        isDeleted: false,
      }),

      Product.countDocuments({
        isDeleted: false,
        isActive: true,
      }),

      Product.countDocuments({
        isDeleted: false,
        isActive: false,
      }),

      Product.countDocuments({
        isDeleted: false,
        featured: true,
      }),

      Product.countDocuments({
        isDeleted: false,
        bestseller: true,
      }),

      Product.countDocuments({
        isDeleted: false,

        $expr: {
          $lte: [
            "$inventory.availableStock",
            "$inventory.lowStockThreshold",
          ],
        },
      }),

      Product.countDocuments({
        isDeleted: false,
        "inventory.availableStock": 0,
      }),
    ]);

    return {
      totalProducts,
      activeProducts,
      inactiveProducts,
      featuredProducts,
      bestsellerProducts,
      lowStockProducts,
      outOfStockProducts,
    };
  }

   async lowStock(limit = 10) {

    return this.model.find({

        isActive: true,

        "inventory.availableStock": {
            $lte: 5,
        },

    })

    .sort({
        "inventory.availableStock": 1,
    })

    .limit(limit);

}

}

export default new ProductRepository();