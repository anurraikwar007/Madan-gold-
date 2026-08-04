import express from "express";

import CouponController from "../controllers/coupon.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// ======================================
// Create Coupon
// ======================================

router.post(
  "/",
  authMiddleware,
  CouponController.create
);

// ======================================
// Get All Coupons
// ======================================

router.get(
  "/",
  authMiddleware,
  CouponController.getAll
);

// ======================================
// Get Coupon By Code
// ======================================

router.get(
  "/code/:code",
  authMiddleware,
  CouponController.getByCode
);

// ======================================
// Get Coupon By Id
// ======================================

router.get(
  "/:id",
  authMiddleware,
  CouponController.getById
);

// ======================================
// Update Coupon
// ======================================

router.put(
  "/:id",
  authMiddleware,
  CouponController.update
);

// ======================================
// Delete Coupon
// ======================================

router.delete(
  "/:id",
  authMiddleware,
  CouponController.delete
);

// ======================================
// Validate Coupon
// ======================================

router.post(
  "/validate",
  CouponController.validate
);

export default router;