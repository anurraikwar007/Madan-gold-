import ProductRepository from "../repositories/product.repository.js";
import CategoryRepository from "../repositories/category.repository.js";
import Order from "../models/order.model.js";
import Admin from "../models/admin.model.js";
import Customer from "../models/customer.model.js";

class DashboardService {
  // =====================================================
  // Complete Dashboard
  // =====================================================

  async getDashboard() {
    const [
      productStats,
      categoryStats,
      orderStats,
      customerStats,
      revenueStats,
      pendingOrders,
      lowStockProducts,
      recentOrders,
    ] = await Promise.all([
      this.getProductStatistics(),
      this.getCategoryStatistics(),
      this.getOrderStatistics(),
      this.getCustomerStatistics(),
      this.getRevenueStatistics(),
      this.getPendingOrders(),
      ProductRepository.getLowStock(),
      this.getRecentOrders(),
    ]);

    return {
      overview: {
        products:
          productStats.totalProducts,

        activeProducts:
          productStats.activeProducts,

        categories:
          categoryStats.totalCategories,

        activeCategories:
          categoryStats.activeCategories,

        customers:
          customerStats.totalCustomers,

        orders:
          orderStats.totalOrders,

        revenue:
          revenueStats.totalRevenue,
      },

      orders: {
        pending:
          pendingOrders,

        completed:
          orderStats.completedOrders,

        cancelled:
          orderStats.cancelledOrders,
      },

      inventory: {
        lowStock:
          lowStockProducts.length,
      },

      recentOrders,

      lowStockProducts,
    };
  }

  // =====================================================
  // Product Statistics
  // =====================================================

  async getProductStatistics() {
    const stats =
      await ProductRepository.getStatistics();

    return (
      stats[0] || {
        totalProducts: 0,
        activeProducts: 0,
        featuredProducts: 0,
        bestsellerProducts: 0,
      }
    );
  }

  // =====================================================
  // Category Statistics
  // =====================================================

  async getCategoryStatistics() {
    const stats =
      await CategoryRepository.getStatistics();

    return (
      stats[0] || {
        totalCategories: 0,
        activeCategories: 0,
        featuredCategories: 0,
      }
    );
  }
    // =====================================================
  // Order Statistics
  // =====================================================

  async getOrderStatistics() {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: null,

          totalOrders: {
            $sum: 1,
          },

          pendingOrders: {
            $sum: {
              $cond: [
                { $eq: ["$orderStatus", "Pending"] },
                1,
                0,
              ],
            },
          },

          completedOrders: {
            $sum: {
              $cond: [
                { $eq: ["$orderStatus", "Delivered"] },
                1,
                0,
              ],
            },
          },

          cancelledOrders: {
            $sum: {
              $cond: [
                { $eq: ["$orderStatus", "Cancelled"] },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    return (
      stats[0] || {
        totalOrders: 0,
        pendingOrders: 0,
        completedOrders: 0,
        cancelledOrders: 0,
      }
    );
  }

  // =====================================================
  // Revenue Statistics
  // =====================================================

  async getRevenueStatistics() {
    const stats = await Order.aggregate([
      {
        $match: {
          paymentStatus: "Paid",
        },
      },

      {
        $group: {
          _id: null,

          totalRevenue: {
            $sum: "$pricing.total",
          },

          averageOrderValue: {
            $avg: "$pricing.total",
          },
        },
      },
    ]);

    return (
      stats[0] || {
        totalRevenue: 0,
        averageOrderValue: 0,
      }
    );
  }

  // =====================================================
  // Customer Statistics
  // =====================================================

 async getCustomerStatistics() {
  const [totalCustomers, totalAdmins] =
    await Promise.all([
      Customer.countDocuments({
        isDeleted: false,
      }),
      Admin.countDocuments({
        isDeleted: false,
      }),
    ]);

  return {
    totalCustomers,
    totalAdmins,
    totalUsers:
      totalCustomers + totalAdmins,
  };
}

  // =====================================================
  // Pending Orders Count
  // =====================================================

  async getPendingOrders() {
    return Order.countDocuments({
      orderStatus: "Pending",
    });
  }
    // =====================================================
  // Recent Orders
  // =====================================================

  async getRecentOrders(limit = 10) {
    return Order.find()
      .populate(
        "customer",
        "name email"
      )
      .sort({
        createdAt: -1,
      })
      .limit(limit)
      .lean();
  }

  // =====================================================
  // Monthly Sales (Last 12 Months)
  // =====================================================

  async getMonthlySales() {
    return Order.aggregate([
      {
        $match: {
          paymentStatus: "Paid",
        },
      },
      {
        $group: {
          _id: {
            year: {
              $year: "$createdAt",
            },
            month: {
              $month: "$createdAt",
            },
          },

          revenue: {
            $sum: "$pricing.total",
          },

          orders: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);
  }

  // =====================================================
  // Top Selling Products
  // =====================================================

  async getTopSellingProducts(
    limit = 10
  ) {
    return Order.aggregate([
      {
        $unwind: "$items",
      },

      {
        $group: {
          _id: "$items.product",

          totalSold: {
            $sum: "$items.quantity",
          },
        },
      },

      {
        $sort: {
          totalSold: -1,
        },
      },

      {
        $limit: limit,
      },
    ]);
  }

  // =====================================================
  // Dashboard Analytics
  // =====================================================

  async getAnalytics() {
    const [
      monthlySales,
      topProducts,
    ] = await Promise.all([
      this.getMonthlySales(),
      this.getTopSellingProducts(),
    ]);

    return {
      monthlySales,
      topProducts,
    };
  }
}

export default new DashboardService();