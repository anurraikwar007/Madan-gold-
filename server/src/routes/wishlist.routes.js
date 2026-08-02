import express from "express";

import {
  getCustomerWishlist,
  wishlistCount,
  addWishlist,
  removeWishlist,
} from "../controllers/wishlist.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

const router = express.Router();

/*
=====================================
Customer Wishlist Routes
=====================================
*/

// Get Wishlist
router.get(
  "/",
  authMiddleware,
  roleMiddleware("Customer"),
  getCustomerWishlist
);

// Wishlist Count
router.get(
  "/count",
  authMiddleware,
  roleMiddleware("Customer"),
  wishlistCount
);

// Add Product To Wishlist
router.post(
  "/:productId",
  authMiddleware,
  roleMiddleware("Customer"),
  addWishlist
);

// Remove Product From Wishlist
router.delete(
  "/:productId",
  authMiddleware,
  roleMiddleware("Customer"),
  removeWishlist
);

export default router;