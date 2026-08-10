import express from "express";

import CouponController from "../controllers/coupon.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

import roleMiddleware from "../middleware/role.middleware.js";

const router = express.Router();

// ======================================
// Create Coupon
// ======================================

router.post(
  "/",
  authMiddleware,
  roleMiddleware("Admin", "SuperAdmin"),
  CouponController.create
);

// ======================================
// Get All Coupons
// ======================================

router.get(
  "/",
  authMiddleware,
  roleMiddleware("Admin", "SuperAdmin"),
  CouponController.getAll
);

// ======================================
// Get Coupon By Code
// ======================================

router.get(
  "/code/:code",
  authMiddleware,
  roleMiddleware("Admin", "SuperAdmin"),
  CouponController.getByCode
);

// ======================================
// Get Coupon By Id
// ======================================

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("Admin", "SuperAdmin"),
  CouponController.getById
);

// ======================================
// Update Coupon
// ======================================

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("Admin", "SuperAdmin"),
  CouponController.update
);

// ======================================
// Delete Coupon
// ======================================

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("Admin", "SuperAdmin"),
  CouponController.delete
);

// ======================================
// Validate Coupon
// ======================================

router.post(
  "/validate",
  authMiddleware,
  roleMiddleware("Customer"),
  CouponController.validate
);

export default router;