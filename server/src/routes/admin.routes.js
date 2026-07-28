import { Router } from "express";

import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

import ProductController from "../controllers/product.controller.js";
import CategoryController from "../controllers/category.controller.js";
import CouponController from "../controllers/coupon.controller.js";
import OrderController from "../controllers/order.controller.js";
import DashboardController from "../controllers/dashboard.controller.js";
const router = Router();

/* ===========================================================
   Dashboard
=========================================================== */

router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware("Admin"),
  DashboardController.getDashboard
);

/* ===========================================================
   Products
=========================================================== */

router.post(
  "/products",
  authMiddleware,
  roleMiddleware("Admin"),
  ProductController.create
);

router.get(
  "/products",
  authMiddleware,
  roleMiddleware("Admin"),
  ProductController.getAll
);

router.get(
  "/products/:id",
  authMiddleware,
  roleMiddleware("Admin"),
  ProductController.getOne
);

router.put(
  "/products/:id",
  authMiddleware,
  roleMiddleware("Admin"),
  ProductController.update
);

router.delete(
  "/products/:id",
  authMiddleware,
  roleMiddleware("Admin"),
  ProductController.remove
);

/* ===========================================================
   Categories
=========================================================== */

/* Categories */

router.post(
  "/categories",
  authMiddleware,
  roleMiddleware("Admin"),
  CategoryController.createCategory
);

router.get(
  "/categories",
  authMiddleware,
  roleMiddleware("Admin"),
  CategoryController.getCategories
);

router.get(
  "/categories/:id",
  authMiddleware,
  roleMiddleware("Admin"),
  CategoryController.getCategoryById
);

router.put(
  "/categories/:id",
  authMiddleware,
  roleMiddleware("Admin"),
  CategoryController.updateCategory
);

router.delete(
  "/categories/:id",
  authMiddleware,
  roleMiddleware("Admin"),
  CategoryController.deleteCategory
);

/* ===========================================================
   Coupons
=========================================================== */

router.post(
  "/coupons",
  authMiddleware,
  roleMiddleware("Admin"),
  CouponController.create
);

router.get(
  "/coupons",
  authMiddleware,
  roleMiddleware("Admin"),
  CouponController.getAll
);

router.get(
  "/coupons/:id",
  authMiddleware,
  roleMiddleware("Admin"),
  CouponController.getById
);

router.put(
  "/coupons/:id",
  authMiddleware,
  roleMiddleware("Admin"),
  CouponController.update
);

router.delete(
  "/coupons/:id",
  authMiddleware,
  roleMiddleware("Admin"),
  CouponController.delete
);

/* ===========================================================
   Orders
=========================================================== */

router.get(
  "/orders",
  authMiddleware,
  roleMiddleware("Admin"),
  OrderController.getAll
);

router.get(
  "/orders/:id",
  authMiddleware,
  roleMiddleware("Admin"),
  OrderController.getOne
);

router.patch(
  "/orders/:id/status",
  authMiddleware,
  roleMiddleware("Admin"),
  OrderController.updateStatus
);

export default router;