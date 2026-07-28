import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

// ======================================
// Get Cart
// ======================================

export const getCart = async (customerId) => {
  let cart = await Cart.findOne({
    customer: customerId,
  }).populate("items.product");

  if (!cart) {
    cart = await Cart.create({
      customer: customerId,
      items: [],
      totalAmount: 0,
    });
  }

  return cart;
};

// ======================================
// Add To Cart
// ======================================

export const addToCart = async (
  customerId,
  productId,
  quantity = 1
) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found.");
  }

  let cart = await Cart.findOne({
    customer: customerId,
  });

  if (!cart) {
    cart = await Cart.create({
      customer: customerId,
      items: [],
      totalAmount: 0,
    });
  }

  const item = cart.items.find(
    (i) => i.product.toString() === productId
  );

  if (item) {
    item.quantity += quantity;
  } else {
    cart.items.push({
      product: productId,
      quantity,
      price: product.price,
    });
  }

  cart.totalAmount = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  await cart.save();

  return await cart.populate("items.product");
};

// ======================================
// Update Cart Quantity
// ======================================

export const updateCartItem = async (
  customerId,
  productId,
  quantity
) => {
  const cart = await Cart.findOne({
    customer: customerId,
  });

  if (!cart) {
    throw new Error("Cart not found.");
  }

  const item = cart.items.find(
    (i) => i.product.toString() === productId
  );

  if (!item) {
    throw new Error("Item not found.");
  }

  item.quantity = quantity;

  cart.totalAmount = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  await cart.save();

  return await cart.populate("items.product");
};

// ======================================
// Remove Cart Item
// ======================================

export const removeCartItem = async (
  customerId,
  productId
) => {
  const cart = await Cart.findOne({
    customer: customerId,
  });

  if (!cart) {
    throw new Error("Cart not found.");
  }

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId
  );

  cart.totalAmount = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  await cart.save();

  return await cart.populate("items.product");
};

// ======================================
// Clear Cart
// ======================================

export const clearCart = async (customerId) => {
  const cart = await Cart.findOne({
    customer: customerId,
  });

  if (!cart) {
    throw new Error("Cart not found.");
  }

  cart.items = [];
  cart.totalAmount = 0;

  await cart.save();

  return cart;
};