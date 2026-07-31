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
  roleMiddleware("Admin"),
  DashboardController.getDashboard
);

// =====================================================
// Dashboard Analytics
// =====================================================

router.get(
  "/analytics",
  authMiddleware,
  roleMiddleware("Admin"),
  DashboardController.getAnalytics
);

// =====================================================
// Product Statistics
// =====================================================

router.get(
  "/products",
  authMiddleware,
  roleMiddleware("Admin"),
  DashboardController.getProductStatistics
);

// =====================================================
// Category Statistics
// =====================================================

router.get(
  "/categories",
  authMiddleware,
  roleMiddleware("Admin"),
  DashboardController.getCategoryStatistics
);

// =====================================================
// Order Statistics
// =====================================================

router.get(
  "/orders",
  authMiddleware,
  roleMiddleware("Admin"),
  DashboardController.getOrderStatistics
);

// =====================================================
// Revenue Statistics
// =====================================================

router.get(
  "/revenue",
  authMiddleware,
  roleMiddleware("Admin"),
  DashboardController.getRevenueStatistics
);

// =====================================================
// Customer Statistics
// =====================================================

router.get(
  "/customers",
  authMiddleware,
  roleMiddleware("Admin"),
  DashboardController.getCustomerStatistics
);

// =====================================================
// Monthly Sales
// =====================================================

router.get(
  "/sales/monthly",
  authMiddleware,
  roleMiddleware("Admin"),
  DashboardController.getMonthlySales
);

// =====================================================
// Recent Orders
// =====================================================

router.get(
  "/orders/recent",
  authMiddleware,
  roleMiddleware("Admin"),
  DashboardController.getRecentOrders
);

// =====================================================
// Top Selling Products
// =====================================================

router.get(
  "/products/top-selling",
  authMiddleware,
  roleMiddleware("Admin"),
  DashboardController.getTopSellingProducts
);

export default router;