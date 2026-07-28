import express from "express";

import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
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
  getWishlist
);

// Add Product To Wishlist
router.post(
  "/:productId",
  authMiddleware,
  roleMiddleware("Customer"),
  addToWishlist
);

// Remove Product From Wishlist
router.delete(
  "/:productId",
  authMiddleware,
  roleMiddleware("Customer"),
  removeFromWishlist
);

// Clear Wishlist
router.delete(
  "/",
  authMiddleware,
  roleMiddleware("Customer"),
  clearWishlist
);

export default router;