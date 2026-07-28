import Wishlist from "../models/wishlist.model.js";
import Product from "../models/product.model.js";

// ======================================
// Get Wishlist
// ======================================

export const getWishlist = async (customerId) => {
  let wishlist = await Wishlist.findOne({
    customer: customerId,
  }).populate("products");

  if (!wishlist) {
    wishlist = await Wishlist.create({
      customer: customerId,
      products: [],
    });
  }

  return wishlist;
};

// ======================================
// Add To Wishlist
// ======================================

export const addToWishlist = async (
  customerId,
  productId
) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found.");
  }

  let wishlist = await Wishlist.findOne({
    customer: customerId,
  });

  if (!wishlist) {
    wishlist = await Wishlist.create({
      customer: customerId,
      products: [],
    });
  }

  const alreadyExists = wishlist.products.some(
    (id) => id.toString() === productId
  );

  if (!alreadyExists) {
    wishlist.products.push(productId);
    await wishlist.save();
  }

  return await wishlist.populate("products");
};

// ======================================
// Remove From Wishlist
// ======================================

export const removeFromWishlist = async (
  customerId,
  productId
) => {
  const wishlist = await Wishlist.findOne({
    customer: customerId,
  });

  if (!wishlist) {
    throw new Error("Wishlist not found.");
  }

  wishlist.products = wishlist.products.filter(
    (id) => id.toString() !== productId
  );

  await wishlist.save();

  return await wishlist.populate("products");
};

// ======================================
// Clear Wishlist
// ======================================

export const clearWishlist = async (
  customerId
) => {
  const wishlist = await Wishlist.findOne({
    customer: customerId,
  });

  if (!wishlist) {
    throw new Error("Wishlist not found.");
  }

  wishlist.products = [];

  await wishlist.save();

  return wishlist;
};