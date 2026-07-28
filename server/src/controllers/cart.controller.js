import asyncHandler from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";

import {
  getCart as getCartService,
  addToCart as addToCartService,
  updateCartItem as updateCartItemService,
  removeCartItem as removeCartItemService,
  clearCart as clearCartService,
} from "../services/cart.service.js";

// ======================================
// Get Cart
// ======================================

export const getCart = asyncHandler(async (req, res) => {
  const cart = await getCartService(req.user._id);

  return res.status(200).json(
    apiResponse.success(
      "Cart fetched successfully.",
      cart
    )
  );
});

// ======================================
// Add To Cart
// ======================================

export const addToCart = asyncHandler(async (req, res) => {
  const { quantity = 1 } = req.body;

  const cart = await addToCartService(
    req.user._id,
    req.params.productId,
    quantity
  );

  return res.status(200).json(
    apiResponse.success(
      "Product added to cart.",
      cart
    )
  );
});

// ======================================
// Update Cart Item
// ======================================

export const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;

  const cart = await updateCartItemService(
    req.user._id,
    req.params.productId,
    quantity
  );

  return res.status(200).json(
    apiResponse.success(
      "Cart updated successfully.",
      cart
    )
  );
});

// ======================================
// Remove Cart Item
// ======================================

export const removeCartItem = asyncHandler(async (req, res) => {
  const cart = await removeCartItemService(
    req.user._id,
    req.params.productId
  );

  return res.status(200).json(
    apiResponse.success(
      "Product removed from cart.",
      cart
    )
  );
});

// ======================================
// Clear Cart
// ======================================

export const clearCart = asyncHandler(async (req, res) => {
  await clearCartService(req.user._id);

  return res.status(200).json(
    apiResponse.success(
      "Cart cleared successfully."
    )
  );
});