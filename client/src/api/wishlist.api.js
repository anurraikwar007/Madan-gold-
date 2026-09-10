import api from "../lib/axios";

// =========================
// Customer Wishlist
// =========================

export const getWishlist = () =>
  api.get("/wishlist");

export const addToWishlist = (productId) =>
  api.post(`/wishlist/${productId}`);

export const removeFromWishlist = (productId) =>
  api.delete(`/wishlist/${productId}`);

export const getWishlistCount = () =>
  api.get("/wishlist/count");