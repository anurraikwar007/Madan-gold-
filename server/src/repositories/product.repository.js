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
    },
  }) {
    return this.paginate({
      filter,
      page,
      limit,
      sort,
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
    })
      .sort({
        createdAt: -1,
      })
      .limit(limit)
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
    })
      .sort({
        averageRating: -1,
        totalReviews: -1,
      })
      .limit(limit)
      .lean();
  }

  // =====================================================
  // Low Stock Products
  // =====================================================

  async getLowStock() {
    return Product.find({
      isDeleted: false,
      isActive: true,

      $expr: {
        $lte: [
          "$inventory.availableStock",
          "$inventory.lowStockThreshold",
        ],
      },
    })
      .sort({
        "inventory.availableStock": 1,
      })
      .lean();
  }

  // =====================================================
  // Out Of Stock Products
  // =====================================================

  async getOutOfStock() {
    return Product.find({
      isDeleted: false,
      isActive: true,

      "inventory.availableStock": 0,
    }).lean();
  }

  // =====================================================
  // Reserve Inventory (Atomic)
  // =====================================================

  async reserveInventory(
    productId,
    quantity,
    session = null
  ) {
    return Product.findOneAndUpdate(
      {
        _id: productId,

        isDeleted: false,

        isActive: true,

        "inventory.availableStock": {
          $gte: quantity,
        },
      },
      {
        $inc: {
          "inventory.availableStock":
            -quantity,

          "inventory.reservedStock":
            quantity,
        },
      },
      {
        new: true,
        session,
      }
    );
  }

  // =====================================================
  // Confirm Inventory
  // =====================================================

  async confirmInventory(
    productId,
    quantity,
    session = null
  ) {
    return Product.findOneAndUpdate(
      {
        _id: productId,

        "inventory.reservedStock": {
          $gte: quantity,
        },
      },
      {
        $inc: {
          "inventory.stock":
            -quantity,

          "inventory.reservedStock":
            -quantity,
        },
      },
      {
        new: true,
        session,
      }
    );
  }

  // =====================================================
  // Release Reserved Inventory
  // =====================================================

  async releaseInventory(
    productId,
    quantity,
    session = null
  ) {
    return Product.findOneAndUpdate(
      {
        _id: productId,

        "inventory.reservedStock": {
          $gte: quantity,
        },
      },
      {
        $inc: {
          "inventory.availableStock":
            quantity,

          "inventory.reservedStock":
            -quantity,
        },
      },
      {
        new: true,
        session,
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
        new: true,
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
        new: true,
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
}

export default new ProductRepository();