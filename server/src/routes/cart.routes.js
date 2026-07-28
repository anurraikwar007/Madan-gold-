import express from "express";

import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cart.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

const router = express.Router();

/*
=========================================
Customer Cart Routes
=========================================
*/

// Get Cart
router.get(
  "/",
  authMiddleware,
  roleMiddleware("Customer"),
  getCart
);

// Add To Cart
router.post(
  "/:productId",
  authMiddleware,
  roleMiddleware("Customer"),
  addToCart
);

// Update Quantity
router.put(
  "/:productId",
  authMiddleware,
  roleMiddleware("Customer"),
  updateCartItem
);

// Remove Item
router.delete(
  "/:productId",
  authMiddleware,
  roleMiddleware("Customer"),
  removeCartItem
);

// Clear Cart
router.delete(
  "/",
  authMiddleware,
  roleMiddleware("Customer"),
  clearCart
);

export default router;