import express from "express";

import ProductController from "../controllers/product.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import validate from "../middleware/validate.js";

import {
  createProductSchema,
  updateProductSchema,
} from "../validators/product.validator.js";

import {
  multipleUpload,
  uploadErrorHandler,
} from "../middleware/upload.middleware.js";

const router = express.Router();

/*
=====================================
Public Routes
=====================================
*/

// Get All Products
router.get(
  "/",
  ProductController.getAll
);

// Get Single Product
router.get(
  "/:id",
  ProductController.getOne
);

/*
=====================================
Admin Routes
=====================================
*/

router.post(
  "/upload-images",
  authMiddleware,
  roleMiddleware("Admin", "SuperAdmin"),
  multipleUpload("images", 10),
  uploadErrorHandler,
  ProductController.uploadImages
);

// Create Product
router.post(
  "/",
  authMiddleware,
  roleMiddleware("Admin", "SuperAdmin"),
  validate(createProductSchema),
  ProductController.create
);

// Update Product
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("Admin", "SuperAdmin"),
  validate(updateProductSchema),
  ProductController.update
);

router.patch(
  "/:id/toggle-active",
  authMiddleware,
  roleMiddleware("Admin", "SuperAdmin"),
  ProductController.toggleActive
);

router.patch(
  "/:id/restore",
  authMiddleware,
  roleMiddleware("Admin", "SuperAdmin"),
  ProductController.restore
);

// Delete Product
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("Admin", "SuperAdmin"),
  ProductController.remove
);

export default router;