import Order from "../models/order.model.js";
import Customer from "../models/customer.model.js";
import Product from "../models/product.model.js";

class DashboardRepository {

  // ==========================================
  // Orders Count
  // ==========================================

  async orderCount(filter = {}) {
    return Order.countDocuments(filter);
  }

  // ==========================================
  // Customers Count
  // ==========================================

  async customerCount(filter = {}) {
    return Customer.countDocuments(filter);
  }

  // ==========================================
  // Products Count
  // ==========================================

  async productCount(filter = {}) {
    return Product.countDocuments(filter);
  }

  // ==========================================
  // Revenue
  // ==========================================

  async revenue() {

    const result = await Order.aggregate([
      {
        $match: {
          paymentStatus: "Paid",
          orderStatus: "Delivered",
        },
      },
      {
        $group: {
          _id: null,

          revenue: {
            $sum: "$totalAmount",
          },

          subtotal: {
            $sum: "$subtotal",
          },

          gst: {
            $sum: "$gst",
          },

          discount: {
            $sum: "$discount",
          },

          shipping: {
            $sum: "$shippingCharge",
          },
        },
      },
    ]);

    return result[0] || {
      revenue: 0,
      subtotal: 0,
      gst: 0,
      discount: 0,
      shipping: 0,
    };
  }

  // ==========================================
  // Low Stock Products
  // ==========================================

  async lowStock(limit = 10) {

    return Product.find({
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

  // ==========================================
  // Recent Orders
  // ==========================================

  async recentOrders(limit = 10) {

    return Order.find()
      .populate("customer")
      .sort({
        createdAt: -1,
      })
      .limit(limit);
  }

  // ==========================================
  // Sales Trend
  // ==========================================

  async salesTrend(rangeFilter = {}) {

    return Order.aggregate([
      {
        $match: {
          paymentStatus: "Paid",
          orderStatus: "Delivered",
          ...rangeFilter,
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
            day: {
              $dayOfMonth: "$createdAt",
            },
          },

          revenue: {
            $sum: "$totalAmount",
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
          "_id.day": 1,
        },
      },
    ]);
  }

  // ==========================================
  // Daily Revenue
  // ==========================================

  async dailyRevenue(rangeFilter = {}) {

    return Order.aggregate([
      {
        $match: {
          paymentStatus: "Paid",
          orderStatus: "Delivered",
          ...rangeFilter,
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
            day: {
              $dayOfMonth: "$createdAt",
            },
          },

          revenue: {
            $sum: "$totalAmount",
          },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
          "_id.day": 1,
        },
      },
    ]);
  }

   // ==========================================
// Dashboard Summary
// ==========================================

async summary() {

    const [

        totalOrders,

        pendingOrders,

        deliveredOrders,

        cancelledOrders,

        totalCustomers,

        totalProducts,

        revenue,

        lowStock,

    ] = await Promise.all([

        this.orderCount(),

        this.orderCount({
            orderStatus: "Pending",
        }),

        this.orderCount({
            orderStatus: "Delivered",
        }),

        this.orderCount({
            orderStatus: "Cancelled",
        }),

        this.customerCount({
            isDeleted: false,
        }),

        this.productCount({
            isDeleted: false,
        }),

        this.revenue(),

        this.lowStock(),

    ]);

    return {

        totalOrders,

        pendingOrders,

        deliveredOrders,

        cancelledOrders,

        totalCustomers,

        totalProducts,

        totalRevenue: revenue.revenue || 0,

        totalGST: revenue.gst || 0,

        totalDiscount: revenue.discount || 0,

        totalShipping: revenue.shipping || 0,

        lowStockProducts: lowStock.length,

    };

}

// ==========================================
// Revenue Analytics
// ==========================================

async revenueAnalytics(rangeFilter = {}) {

    const result = await Order.aggregate([

        {
            $match: {
                paymentStatus: "Paid",
                orderStatus: "Delivered",
                ...rangeFilter,
            },
        },

        {
            $group: {

                _id: null,

                totalRevenue: {
                    $sum: "$totalAmount",
                },

                totalOrders: {
                    $sum: 1,
                },

                averageOrderValue: {
                    $avg: "$totalAmount",
                },

                totalDiscount: {
                    $sum: "$discount",
                },

                totalGST: {
                    $sum: "$gst",
                },

                totalShipping: {
                    $sum: "$shippingCharge",
                },

            },

        },

    ]);

    return result[0] || {

        totalRevenue: 0,
        totalOrders: 0,
        averageOrderValue: 0,
        totalDiscount: 0,
        totalGST: 0,
        totalShipping: 0,

    };

}

    // ==========================================
    // Top Customers
    // ==========================================

    async topCustomers(limit = 10) {

      return Order.aggregate([

        {
          $match: {
            paymentStatus: "Paid",
          },
        },

        {
          $group: {
            _id: "$customer",

            totalOrders: {
              $sum: 1,
            },

            totalSpent: {
              $sum: "$totalAmount",
            },
          },
        },

        {
          $sort: {
            totalSpent: -1,
          },
        },

        {
          $limit: limit,
        },

        {
          $lookup: {
            from: "customers",
            localField: "_id",
            foreignField: "_id",
            as: "customer",
          },
        },

        {
          $unwind: "$customer",
        },

        {
          $project: {
            _id: 0,

            customerId: "$customer._id",

            name: "$customer.name",

            email: "$customer.email",

            phone: "$customer.phone",

            totalOrders: 1,

            totalSpent: 1,
          },
        },

      ]);

    }
 

}

export default new DashboardRepository();