import { Router } from "express";

import {
  login,
  me,
  logout,
  logoutAll,
} from "../controllers/adminAuth.controller.js";


import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import validate from "../middleware/validate.js";


import {
  adminLoginSchema,
} from "../validators/auth.validator.js";


import ProductController from "../controllers/product.controller.js";
import CategoryController from "../controllers/category.controller.js";
import CouponController from "../controllers/coupon.controller.js";
import OrderController from "../controllers/order.controller.js";
import DashboardController from "../controllers/dashboard.controller.js";


const router = Router();



/*
===========================================================
Admin Authentication Routes
===========================================================
*/


/**
 * @route   POST /api/v1/admin/login
 * @desc    Admin login
 * @access  Public
 */
router.post(
  "/login",
  validate(adminLoginSchema),
  login
);
  
/**
 * @route   POST /api/v1/admin/logout
 * @desc    Admin logout
 * @access  Private (Admin)
 */
router.post(
  "/logout",
  authMiddleware,
  roleMiddleware("Admin", "SuperAdmin"),
  logout
);

router.post(
  "/logout-all",
  authMiddleware,
  roleMiddleware("Admin", "SuperAdmin"),
  logoutAll
);


/**
 * @route   GET /api/v1/admin/me
 * @desc    Get admin profile
 * @access  Private (Admin)
 */
router.get(
  "/me",
  authMiddleware,
  roleMiddleware("Admin","SuperAdmin"),
  me
);



/*
===========================================================
Admin Protected Routes
===========================================================
*/

router.use(
  authMiddleware,
  roleMiddleware("Admin","SuperAdmin")
);
/*
===========================================================
Dashboard
===========================================================
*/


/**
 * @route   GET /api/v1/admin/dashboard
 * @desc    Admin dashboard data
 * @access  Private (Admin)
 */
router.get(
  "/dashboard",
  DashboardController.getDashboard
);



/*
===========================================================
Products Management
===========================================================
*/


/**
 * @route   POST /api/v1/admin/products
 * @desc    Create product
 * @access  Private (Admin)
 */
router.post(
  "/products",
  ProductController.create
);



/**
 * @route   GET /api/v1/admin/products
 * @desc    Get all products
 * @access  Private (Admin)
 */
router.get(
  "/products",
  ProductController.getAll
);



/**
 * @route   GET /api/v1/admin/products/:id
 * @desc    Get single product
 * @access  Private (Admin)
 */
router.get(
  "/products/:id",
  ProductController.getOne
);



/**
 * @route   PUT /api/v1/admin/products/:id
 * @desc    Update product
 * @access  Private (Admin)
 */
router.put(
  "/products/:id",
  ProductController.update
);



/**
 * @route   DELETE /api/v1/admin/products/:id
 * @desc    Delete product
 * @access  Private (Admin)
 */
router.delete(
  "/products/:id",
  ProductController.remove
);



/*
===========================================================
Category Management
===========================================================
*/


/**
 * @route   POST /api/v1/admin/categories
 * @desc    Create category
 * @access  Private (Admin)
 */
router.post(
  "/categories",
  CategoryController.createCategory
);



/**
 * @route   GET /api/v1/admin/categories
 * @desc    Get all categories
 * @access  Private (Admin)
 */
router.get(
  "/categories",
  CategoryController.getCategories
);



/**
 * @route   GET /api/v1/admin/categories/:id
 * @desc    Get category by id
 * @access  Private (Admin)
 */
router.get(
  "/categories/:id",
  CategoryController.getCategoryById
);



/**
 * @route   PUT /api/v1/admin/categories/:id
 * @desc    Update category
 * @access  Private (Admin)
 */
router.put(
  "/categories/:id",
  CategoryController.updateCategory
);



/**
 * @route   DELETE /api/v1/admin/categories/:id
 * @desc    Delete category
 * @access  Private (Admin)
 */
router.delete(
  "/categories/:id",
  CategoryController.deleteCategory
);
/*
===========================================================
Coupon Management
===========================================================
*/


/**
 * @route   POST /api/v1/admin/coupons
 * @desc    Create coupon
 * @access  Private (Admin)
 */
router.post(
  "/coupons",
  CouponController.create
);



/**
 * @route   GET /api/v1/admin/coupons
 * @desc    Get all coupons
 * @access  Private (Admin)
 */
router.get(
  "/coupons",
  CouponController.getAll
);



/**
 * @route   GET /api/v1/admin/coupons/:id
 * @desc    Get coupon by id
 * @access  Private (Admin)
 */
router.get(
  "/coupons/:id",
  CouponController.getById
);



/**
 * @route   PUT /api/v1/admin/coupons/:id
 * @desc    Update coupon
 * @access  Private (Admin)
 */
router.put(
  "/coupons/:id",
  CouponController.update
);



/**
 * @route   DELETE /api/v1/admin/coupons/:id
 * @desc    Delete coupon
 * @access  Private (Admin)
 */
router.delete(
  "/coupons/:id",
  CouponController.delete
);



/*
===========================================================
Order Management
===========================================================
*/


/**
 * @route   GET /api/v1/admin/orders
 * @desc    Get all orders
 * @access  Private (Admin)
 */
router.get(
  "/orders",
  OrderController.getAll
);



/**
 * @route   GET /api/v1/admin/orders/:id
 * @desc    Get single order
 * @access  Private (Admin)
 */
router.get(
  "/orders/:id",
  OrderController.getOne
);



/**
 * @route   PATCH /api/v1/admin/orders/:id/status
 * @desc    Update order status
 * @access  Private (Admin)
 */
router.patch(
  "/orders/:id/status",
  OrderController.updateStatus
);



/*
===========================================================
Export Router
===========================================================
*/

export default router;