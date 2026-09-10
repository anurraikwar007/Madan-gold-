import express from "express";

import validate from "../middleware/validate.js";

import {
  addToCartSchema,
  updateCartSchema,
  removeCartItemSchema,
} from "../validators/cart.validator.js";

import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  getCartSummary,
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
  validate(addToCartSchema),
  addToCart
);

// Update Quantity
  router.put(
    "/:productId",
    authMiddleware,
    roleMiddleware("Customer"),
    validate(updateCartSchema),
    updateCartItem
  );

// Remove Item
router.delete(
  "/:productId",
  authMiddleware,
  roleMiddleware("Customer"),
  validate(removeCartItemSchema),
  removeCartItem
);

// Clear Cart
router.delete(
  "/",
  authMiddleware,
  roleMiddleware("Customer"),
  clearCart
);
  
   // Get Cart Summary 

  router.get(

    "/summary",

    authMiddleware,

    roleMiddleware("Customer"),

    getCartSummary

);


export default router;