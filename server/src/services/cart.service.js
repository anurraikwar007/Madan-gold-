import CartRepository from "../repositories/cart.repository.js";
import ProductRepository from "../repositories/product.repository.js";
import AuditService from "./audit.service.js";
import { CartDTO } from "../dto/cart.dto.js";

// ======================================
// Get Cart
// ======================================

export const getCart = async (customerId) => {

  let cart =
    await CartRepository.findByCustomer(customerId);

  if (!cart) {

    cart =
      await CartRepository.createCart(customerId);

    cart =
      await CartRepository.findByCustomer(customerId);

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

  const dto =
    CartDTO.add({ quantity });

  const product =
    await ProductRepository.findActiveById(productId);

  if (!product) {
    throw new Error("Product not found.");
  }

  if (
    product.inventory.availableStock <
    dto.quantity
  ) {
    throw new Error("Insufficient stock.");
  }

  let cart =
    await CartRepository.findByCustomer(customerId);

  if (!cart) {

    cart =
      await CartRepository.createCart(customerId);

  }

  const item =
    cart.items.find(

      (i) =>
        i.product._id.toString() === productId

    );

  if (item) {

    item.quantity += dto.quantity;

  }

  else {

    cart.items.push({

      product: product._id,

      quantity: dto.quantity,

      price: product.price,

    });

  }

  await CartRepository.saveCart(cart);

  return CartRepository.findByCustomer(customerId);

};

// ======================================
// Update Cart Quantity
// ======================================

export const updateCartItem = async (
  customerId,
  productId,
  quantity
) => {

  const dto =
    CartDTO.update({ quantity });

  const cart =
    await CartRepository.findByCustomer(customerId);

  if (!cart) {
    throw new Error("Cart not found.");
  }

  const item =
    cart.items.find(
      (i) =>
        i.product._id.toString() === productId
    );

  if (!item) {
    throw new Error("Item not found.");
  }

  const product =
    await ProductRepository.findActiveById(productId);

  if (!product) {
    throw new Error("Product not found.");
  }

  if (
    product.inventory.availableStock <
    dto.quantity
  ) {
    throw new Error("Insufficient stock.");
  }

  item.quantity = dto.quantity;

  await CartRepository.saveCart(cart);

  return CartRepository.findByCustomer(customerId);

};

// ======================================
// Remove Cart Item
// ======================================

export const removeCartItem = async (
  customerId,
  productId
) => {

  const cart =
    await CartRepository.findByCustomer(customerId);

  if (!cart) {
    throw new Error("Cart not found.");
  }

  cart.items =
    cart.items.filter(
      (item) =>
        item.product._id.toString() !== productId
    );

  await CartRepository.saveCart(cart);

  return CartRepository.findByCustomer(customerId);

};

// ======================================
// Clear Cart
// ======================================

export const clearCart = async (
  customerId
) => {

  const cart =
    await CartRepository.findByCustomer(customerId);

  if (!cart) {
    throw new Error("Cart not found.");
  }

  cart.items = [];

  await CartRepository.saveCart(cart);

  return true;

};

// ======================================
// Get Cart Summary
// ======================================

export const getCartSummary = async (
  customerId
) => {

  const cart =
    await CartRepository.findByCustomer(customerId);

  if (!cart) {
    throw new Error("Cart not found.");
  }

  return {

    totalItems:
      cart.totalItems,

    totalAmount:
      cart.totalAmount,

    quantity:
      cart.items.reduce(

        (sum, item) =>
          sum + item.quantity,

        0

      ),

  };

};