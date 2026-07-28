import asyncHandler from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";

import {
  getWishlist as getWishlistService,
  addToWishlist as addToWishlistService,
  removeFromWishlist as removeFromWishlistService,
  clearWishlist as clearWishlistService,
} from "../services/wishlist.service.js";

// ======================================
// Get Wishlist
// ======================================

export const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await getWishlistService(req.user._id);

  return res.status(200).json(
    apiResponse.success(
      "Wishlist fetched successfully.",
      wishlist
    )
  );
});

// ======================================
// Add To Wishlist
// ======================================

export const addToWishlist = asyncHandler(async (req, res) => {
  const wishlist = await addToWishlistService(
    req.user._id,
    req.params.productId
  );

  return res.status(200).json(
    apiResponse.success(
      "Product added to wishlist.",
      wishlist
    )
  );
});

// ======================================
// Remove From Wishlist
// ======================================

export const removeFromWishlist = asyncHandler(async (req, res) => {
  const wishlist = await removeFromWishlistService(
    req.user._id,
    req.params.productId
  );

  return res.status(200).json(
    apiResponse.success(
      "Product removed from wishlist.",
      wishlist
    )
  );
});

// ======================================
// Clear Wishlist
// ======================================

export const clearWishlist = asyncHandler(async (req, res) => {
  await clearWishlistService(req.user._id);

  return res.status(200).json(
    apiResponse.success(
      "Wishlist cleared successfully."
    )
  );
});