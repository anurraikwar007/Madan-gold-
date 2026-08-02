import { Router } from "express";

import DashboardController from "../controllers/dashboard.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

const router = Router();

// =====================================================
// Dashboard Overview
// =====================================================

router.get(
  "/",
  authMiddleware,
  roleMiddleware("Admin","SuperAdmin"),
  DashboardController.getDashboard
);

// =====================================================
// Dashboard Analytics
// =====================================================

router.get(
  "/analytics",
  authMiddleware,
  roleMiddleware("Admin","SuperAdmin"),
  DashboardController.getAnalytics
);

// =====================================================
// Product Statistics
// =====================================================

router.get(
  "/products",
  authMiddleware,
  roleMiddleware("Admin","SuperAdmin"),
  DashboardController.getProductStatistics
);

// =====================================================
// Category Statistics
// =====================================================

router.get(
  "/categories",
  authMiddleware,
  roleMiddleware("Admin","SuperAdmin"),
  DashboardController.getCategoryStatistics
);

// =====================================================
// Order Statistics
// =====================================================

router.get(
  "/orders",
  authMiddleware,
  roleMiddleware("Admin","SuperAdmin"),
  DashboardController.getOrderStatistics
);

// =====================================================
// Revenue Statistics
// =====================================================

router.get(
  "/revenue",
  authMiddleware,
  roleMiddleware("Admin","SuperAdmin"),
  DashboardController.getRevenueStatistics
);

// =====================================================
// Customer Statistics
// =====================================================

router.get(
  "/customers",
  authMiddleware,
  roleMiddleware("Admin","SuperAdmin"),
  DashboardController.getCustomerStatistics
);

// =====================================================
// Monthly Sales
// =====================================================

router.get(
  "/sales/monthly",
  authMiddleware,
  roleMiddleware("Admin","SuperAdmin"),
  DashboardController.getMonthlySales
);

// =====================================================
// Recent Orders
// =====================================================

router.get(
  "/orders/recent",
  authMiddleware,
  roleMiddleware("Admin","SuperAdmin"),
  DashboardController.getRecentOrders
);

// =====================================================
// Top Selling Products
// =====================================================

router.get(
  "/products/top-selling",
  authMiddleware,
  roleMiddleware("Admin","SuperAdmin"),
  DashboardController.getTopSellingProducts
);

// =====================================================
// Top Customers
// =====================================================

router.get(
  "/customers/top",
  authMiddleware,
  roleMiddleware("Admin","SuperAdmin"),
  DashboardController.getTopCustomers
);
  
// =====================================================
// Revenue Analytics
// =====================================================

  router.get(
    "/revenue/analytics",
    authMiddleware,
    roleMiddleware("Admin", "SuperAdmin"),
    DashboardController.getRevenueAnalytics
);

// =====================================================
// Sales Trend
// =====================================================

router.get(
  "/sales/trend",
  authMiddleware,
  roleMiddleware("Admin", "SuperAdmin"),
  DashboardController.getSalesTrend
);

 // =====================================================
 // Daily Revenue
 // =====================================================

 router.get(
    "/daily-revenue",
    authMiddleware,
    roleMiddleware("Admin", "SuperAdmin"),
    DashboardController.getDailyRevenue
);

export default router;