import WishlistRepository from "../repositories/wishlist.repository.js";
import ProductRepository from "../repositories/product.repository.js";
import ApiError from "../utils/apiError.js";

// ======================================================
// Get Wishlist
// ======================================================

export const getWishlist = async (customerId) => {
  return WishlistRepository.getCustomerWishlist(customerId);
};

// ======================================================
// Wishlist Count
// ======================================================

export const getWishlistCount = async (customerId) => {
  return WishlistRepository.countWishlist(customerId);
};

// ======================================================
// Add To Wishlist
// ======================================================

export const addToWishlist = async (
  customerId,
  productId
) => {

  const product =
    await ProductRepository.findActiveById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  const exists =
    await WishlistRepository.findWishlist(
      customerId,
      productId
    );

  if (exists) {
    throw new ApiError(
      409,
      "Product already exists in wishlist."
    );
  }

  return WishlistRepository.create({
    customer: customerId,
    product: productId,
  });
};

// ======================================================
// Remove Wishlist
// ======================================================

export const removeFromWishlist = async (
  customerId,
  productId
) => {

  const item =
    await WishlistRepository.removeWishlist(
      customerId,
      productId
    );

  if (!item) {
    throw new ApiError(
      404,
      "Wishlist item not found."
    );
  }

  return true;
};