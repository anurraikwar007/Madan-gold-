import CartRepository from "../repositories/cart.repository.js";
import ProductRepository from "../repositories/product.repository.js";
import AuditService from "./audit.service.js";
import { CartDTO } from "../dto/cart.dto.js";
import ApiError from "../utils/apiError.js";
import {getSellingPrice,} from "../utils/pricing.util.js";



    const getCurrentProductPrice = (
      product
    ) => getSellingPrice(product);

    const syncCartPrices = async (cart) => {
      let changed = false;

      for (const item of cart.items) {
        const product = item.product;

        if (!product) {
          continue;
        }

        const currentPrice =
          getCurrentProductPrice(product);

        if (item.price !== currentPrice) {
          item.price = currentPrice;
          changed = true;
        }
      }

      if (changed) {
        await CartRepository.saveCart(cart);
      }

      return cart;
    };

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

  return syncCartPrices(cart);

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
    await ProductRepository.findActiveById(
      productId
    );

  if (!product) {
    throw new ApiError(
      404,
      "Product not found."
    );
  }

  if (
    product.metal !== "Silver" ||
    product.purity !== "925 Silver"
  ) {
    throw new ApiError(
      400,
      "Only 925 Silver jewellery is available."
    );
  }

  const availableStock =
    Number(
      product.inventory?.availableStock || 0
    );

  let cart =
    await CartRepository.findByCustomer(
      customerId
    );

  if (!cart) {
    cart =
      await CartRepository.createCart(
        customerId
      );
  }

  const existingItem =
    cart.items.find(
      (item) =>
        item.product._id.toString() ===
        productId.toString()
    );

  const requestedQuantity =
    (existingItem?.quantity || 0) +
    dto.quantity;

  if (
    availableStock <
    requestedQuantity
  ) {
    throw new ApiError(
      409,
      `Only ${availableStock} item(s) available.`
    );
  }

  if (existingItem) {
    existingItem.quantity =
      requestedQuantity;

    existingItem.price =
      getSellingPrice(product);
  } else {
    cart.items.push({
      product: product._id,
      quantity: dto.quantity,
      price:
        getSellingPrice(product),
    });
  }

  await CartRepository.saveCart(cart);

  const updatedCart =
    await CartRepository.findByCustomer(
      customerId
    );

  return syncCartPrices(
    updatedCart
  );
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
    await CartRepository.findByCustomer(
      customerId
    );

  if (!cart) {
    throw new ApiError(
      404,
      "Cart not found."
    );
  }

  const item =
    cart.items.find(
      (cartItem) =>
        cartItem.product._id.toString() ===
        productId.toString()
    );

  if (!item) {
    throw new ApiError(
      404,
      "Item not found."
    );
  }

  const product =
    await ProductRepository.findActiveById(
      productId
    );

  if (!product) {
    throw new ApiError(
      404,
      "Product not found."
    );
  }

  const availableStock =
    Number(
      product.inventory?.availableStock || 0
    );

  if (
    availableStock <
    dto.quantity
  ) {
    throw new ApiError(
      409,
      `Only ${availableStock} item(s) available.`
    );
  }

  item.quantity =
    dto.quantity;

  item.price =
    getSellingPrice(product);

  await CartRepository.saveCart(
    cart
  );

  const updatedCart =
    await CartRepository.findByCustomer(
      customerId
    );

  return syncCartPrices(
    updatedCart
  );
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