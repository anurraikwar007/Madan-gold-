import express from "express";

import CheckoutController from "../controllers/checkout.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

const router = express.Router();

/*
=====================================================
Customer Checkout Routes
=====================================================
*/

// Create Checkout
router.post(
  "/",
  authMiddleware,
  roleMiddleware("Customer"),
  CheckoutController.create
);

// Get Current Checkout
router.get(
  "/",
  authMiddleware,
  roleMiddleware("Customer"),
  CheckoutController.getCurrent
);

// Get Checkout By Id
router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("Customer"),
  CheckoutController.getById
);

// Update Shipping Address
router.put(
  "/:id/address",
  authMiddleware,
  roleMiddleware("Customer"),
  CheckoutController.updateAddress
);

// Apply Coupon
router.put(
  "/:id/coupon",
  authMiddleware,
  roleMiddleware("Customer"),
  CheckoutController.applyCoupon
);

// Remove Coupon
router.delete(
  "/:id/coupon",
  authMiddleware,
  roleMiddleware("Customer"),
  CheckoutController.removeCoupon
);

// Complete Checkout
router.post(
  "/:id/complete",
  authMiddleware,
  roleMiddleware("Customer"),
  CheckoutController.complete
);

// Cancel Checkout
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("Customer"),
  CheckoutController.cancel
);

export default router;