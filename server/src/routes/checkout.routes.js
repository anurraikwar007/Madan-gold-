import express from "express";

import CheckoutController from "../controllers/checkout.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

import validate from "../middleware/validate.js";
import CheckoutValidator
  from "../validators/checkout.validator.js";

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
  validate({
    body: CheckoutValidator.create(),
  }),
  CheckoutController.create
);

// Get Current Checkout
router.get(
  "/",
  authMiddleware,
  roleMiddleware("Customer"),
  CheckoutController.get
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
  validate({
    params:
      CheckoutValidator.checkoutId(),
    body:
      CheckoutValidator.shippingAddress(),
  }),
  CheckoutController.updateShippingAddress
);

// Apply Coupon
router.put(
  "/:id/coupon",
  authMiddleware,
  roleMiddleware("Customer"),
  validate({
    params:
      CheckoutValidator.checkoutId(),
    body:
      CheckoutValidator.applyCoupon(),
  }),
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
  validate({
    params:
      CheckoutValidator.checkoutId(),
  }),
  CheckoutController.complete
);

// Cancel Checkout
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("Customer"),
  CheckoutController.remove
);

export default router;