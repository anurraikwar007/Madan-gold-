import ProductRepository from "../repositories/product.repository.js";
import CategoryRepository from "../repositories/category.repository.js";
import DashboardRepository from "../repositories/dashboard.repository.js";
import Order from "../models/order.model.js";
import Admin from "../models/admin.model.js";
import Customer from "../models/customer.model.js";


     // =====================================
    // Date Range Helper
   // =====================================

const getDateFilter = (range = "all") => {

    const now = new Date();

    switch (range) {

        case "today":

            return {
                createdAt: {
                    $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate())
                }
            };

        case "week": {

            const start = new Date(now);

            start.setDate(now.getDate() - 7);

            return {
                createdAt: {
                    $gte: start
                }
            };

        }

        case "month":

        return {
            createdAt: {
                $gte: new Date(now.getFullYear(), now.getMonth(), 1)
            }
       };

        case "year":

            return {
                createdAt: {
                    $gte: new Date(now.getFullYear(), 0, 1)
                }
            };

        default:

            return {};

    }

};
   
   
     

class DashboardService {
    
   // ==========================================
  // Revenue Analytics
  // ==========================================

 async getRevenueAnalytics(range = "all") {

    const filter = getDateFilter(range);

    return DashboardRepository.revenueAnalytics(filter);

 }

  // =====================================================
  // Complete Dashboard
  // =====================================================
  
  async getTopCustomers(limit = 10) {

    return DashboardRepository.topCustomers(limit);

    }

  async getDashboard(range = "all") {
   const filter = getDateFilter(range);

  const [
    productStats,
    categoryStats,
    customerStats,
    orderStats,
    revenueStats,
    pendingOrders,
    recentOrders,
    lowStockProducts,
  ] = await Promise.all([
    this.getProductStatistics(),

    this.getCategoryStatistics(),

    this.getCustomerStatistics(),

    this.getOrderStatistics(filter),

    this.getRevenueStatistics(filter),

    this.getPendingOrders(filter),

    this.getRecentOrders(10, filter),

    DashboardRepository.lowStock(),
  ]);

  return {
    range,

    overview: {
      products: productStats.totalProducts,
      activeProducts: productStats.activeProducts,

      categories: categoryStats.totalCategories,
      activeCategories: categoryStats.activeCategories,

      customers: customerStats.totalCustomers,

      orders: orderStats.totalOrders,

      revenue: revenueStats.totalRevenue,
    },

    orders: {
      pending: pendingOrders,
      completed: orderStats.completedOrders,
      cancelled: orderStats.cancelledOrders,
    },

    inventory: {
      lowStock: lowStockProducts.length,
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

  async getOrderStatistics(
  filter = {}
) {
    const stats = await Order.aggregate([
      {
        $match: filter,
      },

      {
        $group: {
          _id: null,

          totalOrders: {
            $sum: 1,
          },

          pendingOrders: {
            $sum: {
              $cond: [
                {
                  $eq: [
                    "$orderStatus",
                    "Pending",
                  ],
                },
                1,
                0,
              ],
            },
          },

          completedOrders: {
            $sum: {
              $cond: [
                {
                  $eq: [
                    "$orderStatus",
                    "Delivered",
                  ],
                },
                1,
                0,
              ],
            },
          },

          cancelledOrders: {
            $sum: {
              $cond: [
                {
                  $eq: [
                    "$orderStatus",
                    "Cancelled",
                  ],
                },
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

     async getRevenueStatistics(
        filter = {}
      ) {
        const stats = await Order.aggregate([
          {
            $match: {
              ...filter,
              paymentStatus: "Paid",
              orderStatus: "Delivered",
            },
          },

          {
            $group: {
              _id: null,

              totalRevenue: {
                $sum: "$totalAmount",
              },

              averageOrderValue: {
                $avg: "$totalAmount",
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
      // Sales Trend
     // =====================================================
      async getSalesTrend(range = "all") {

        const filter = getDateFilter(range);

        return DashboardRepository.salesTrend(filter);

    }

    // =====================================================
  // Daily Revenue
  // =====================================================

      async getDailyRevenue(range = "all") {

    const filter = getDateFilter(range);

    return DashboardRepository.dailyRevenue(filter);

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

  async getPendingOrders(
      filter = {}
    ) {
        return Order.countDocuments({
          ...filter,
          orderStatus: "Pending",
        });
    }
    // =====================================================
  // Recent Orders
  // =====================================================

  async getRecentOrders(
  limit = 10,
  filter = {}
) {
    return Order.find(filter)
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
            $sum:"$totalAmount",
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

    async getTopSellingProducts(limit = 10) {

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

      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },

      {
        $unwind: "$product",
      },

      {
        $project: {

          _id: "$product._id",

          name: "$product.name",

          slug: "$product.slug",

          thumbnail: "$product.thumbnail",

          totalSold: 1,

        },
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