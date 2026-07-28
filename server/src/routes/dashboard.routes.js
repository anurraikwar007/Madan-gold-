import { Router } from "express";

import DashboardController from "../controllers/dashboard.controller.js";

import authenticate from "../middleware/auth.middleware.js";
import authorize from "../middleware/authorize.middleware.js";

const router = Router();

// =====================================================
// Dashboard Overview
// =====================================================

router.get(
  "/",
  authenticate,
  authorize("Admin"),
  DashboardController.getDashboard
);

// =====================================================
// Dashboard Analytics
// =====================================================

router.get(
  "/analytics",
  authenticate,
  authorize("Admin"),
  DashboardController.getAnalytics
);

// =====================================================
// Product Statistics
// =====================================================

router.get(
  "/products",
  authenticate,
  authorize("Admin"),
  DashboardController.getProductStatistics
);

// =====================================================
// Category Statistics
// =====================================================

router.get(
  "/categories",
  authenticate,
  authorize("Admin"),
  DashboardController.getCategoryStatistics
);

// =====================================================
// Order Statistics
// =====================================================

router.get(
  "/orders",
  authenticate,
  authorize("Admin"),
  DashboardController.getOrderStatistics
);

// =====================================================
// Revenue Statistics
// =====================================================

router.get(
  "/revenue",
  authenticate,
  authorize("Admin"),
  DashboardController.getRevenueStatistics
);

// =====================================================
// Customer Statistics
// =====================================================

router.get(
  "/customers",
  authenticate,
  authorize("Admin"),
  DashboardController.getCustomerStatistics
);

// =====================================================
// Monthly Sales
// =====================================================

router.get(
  "/sales/monthly",
  authenticate,
  authorize("Admin"),
  DashboardController.getMonthlySales
);

// =====================================================
// Recent Orders
// =====================================================

router.get(
  "/orders/recent",
  authenticate,
  authorize("Admin"),
  DashboardController.getRecentOrders
);

// =====================================================
// Top Selling Products
// =====================================================

router.get(
  "/products/top-selling",
  authenticate,
  authorize("Admin"),
  DashboardController.getTopSellingProducts
);

export default router;