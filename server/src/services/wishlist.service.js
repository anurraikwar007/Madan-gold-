import WishlistRepository from "../repositories/wishlist.repository.js";
import ProductRepository from "../repositories/product.repository.js";

// ======================================================
// Get Wishlist
// ======================================================

export const getWishlist = async (customerId) => {

    return WishlistRepository.getCustomerWishlist(
        customerId
    );

};

// ======================================================
// Wishlist Count
// ======================================================

export const getWishlistCount = async (customerId) => {

    return WishlistRepository.countWishlist(
        customerId
    );

};

// ======================================================
// Add To Wishlist
// ======================================================

export const addToWishlist = async (
    customerId,
    productId
) => {

    // ==========================================
    // Product Exists
    // ==========================================

    const product =
        await ProductRepository.findById(productId);

    if (!product) {

        throw new Error("Product not found.");

    }

    // ==========================================
    // Already Exists
    // ==========================================

    const exists =
        await WishlistRepository.findWishlist(
            customerId,
            productId
        );

    if (exists) {

        throw new Error(
            "Product already exists in wishlist."
        );

    }

    // ==========================================
    // Create Wishlist
    // ==========================================

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

        throw new Error(
            "Wishlist item not found."
        );

    }

    return true;

};