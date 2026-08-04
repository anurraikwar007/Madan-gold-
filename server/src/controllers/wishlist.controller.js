import asyncHandler from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";

import {
  getWishlist,
  getWishlistCount,
  addToWishlist,
  removeFromWishlist,
} from "../services/wishlist.service.js";

// ======================================================
// Get Wishlist
// ======================================================

export const getCustomerWishlist = asyncHandler(async (req, res) => {
  const wishlist = await getWishlist(req.user._id);

  return res.status(200).json(
    apiResponse.success(
      "Wishlist fetched successfully.",
      wishlist
    )
  );
});

// ======================================================
// Wishlist Count
// ======================================================

export const wishlistCount = asyncHandler(async (req, res) => {
  const count = await getWishlistCount(req.user._id);

  return res.status(200).json(
    apiResponse.success(
      "Wishlist count fetched successfully.",
      {
        count,
      }
    )
  );
});

// ======================================================
// Add To Wishlist
// ======================================================

export const addWishlist = asyncHandler(async (req, res) => {
  const wishlist = await addToWishlist(
    req.user._id,
    req.params.productId
  );

  return res.status(201).json(
    apiResponse.success(
      "Product added to wishlist.",
      wishlist
    )
  );
});

// ======================================================
// Remove From Wishlist
// ======================================================

export const removeWishlist = asyncHandler(async (req, res) => {
  await removeFromWishlist(
    req.user._id,
    req.params.productId
  );

  return res.status(200).json(
    apiResponse.success(
      "Product removed from wishlist."
    )
  );
});