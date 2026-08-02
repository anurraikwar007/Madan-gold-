import { Router } from "express";

import CategoryController from "../controllers/category.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = Router();



/*
=========================================================
Admin Routes
=========================================================
*/

// All Categories
router.get(
  "/admin/all",
  authMiddleware,
  roleMiddleware("Admin","SuperAdmin"),
  CategoryController.getCategories
);

// Statistics
router.get(
  "/admin/statistics",
  authMiddleware,
  roleMiddleware("Admin","SuperAdmin"),
  CategoryController.getStatistics
);

// Create Category
router.post(
  "/",
  authMiddleware,
  roleMiddleware("Admin","SuperAdmin"),
  upload.single("image"),
  CategoryController.createCategory
);

// Update Category
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("Admin","SuperAdmin"),
  upload.single("image"),
  CategoryController.updateCategory
);

// Soft Delete
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("Admin","SuperAdmin"),
  CategoryController.deleteCategory
);

// Restore
router.patch(
  "/:id/restore",
  authMiddleware,
  roleMiddleware("Admin","SuperAdmin"),
  CategoryController.restoreCategory
);

// Toggle Active
router.patch(
  "/:id/toggle-active",
  authMiddleware,
  roleMiddleware("Admin","SuperAdmin"),
  CategoryController.toggleActive
);

// Toggle Featured
router.patch(
  "/:id/toggle-featured",
  authMiddleware,
  roleMiddleware("Admin","SuperAdmin"),
  CategoryController.toggleFeatured
);

// Update Display Order
router.patch(
  "/:id/display-order",
  authMiddleware,
  roleMiddleware("Admin","SuperAdmin"),
  CategoryController.updateDisplayOrder
);

// Bulk Reorder
router.patch(
  "/reorder",
  authMiddleware,
  roleMiddleware("Admin","SuperAdmin"),
  CategoryController.reorderCategories
);

/*
=========================================================
Customer Routes
=========================================================
*/

// Active Categories
router.get(
  "/",
  CategoryController.getActiveCategories
);

// Category By Slug
router.get(
  "/slug/:slug",
  CategoryController.getCategoryBySlug
);

// Category By ID
router.get(
  "/:id",
  CategoryController.getCategoryById
);

export default router;