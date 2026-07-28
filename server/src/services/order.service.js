import mongoose from "mongoose";

import OrderRepository from "../repositories/order.repository.js";
import CartRepository from "../repositories/cart.repository.js";
import CouponRepository from "../repositories/coupon.repository.js";
import ProductRepository from "../repositories/product.repository.js";

import AuditService from "./audit.service.js";

import { createOrderDTO } from"../dto/order.dto.js";

import { generateOrderNumber } from "../utils/orderNumber.js";

import { getObjectDiff } from "../utils/diff.util.js";

// ======================================================
// Private Helpers
// ======================================================

const validateCart = (cart) => {

  if (!cart) {

    throw new Error(
      "Cart not found."
    );

  }

  if (!cart.items.length) {

    throw new Error(
      "Your cart is empty."
    );

  }

};

// ======================================================
// Shipping Address Validation
// ======================================================

const validateShippingAddress =
(address) => {

  if (!address) {

    throw new Error(
      "Shipping address is required."
    );

  }

  const requiredFields = [

    "fullName",

    "phone",

    "house",

    "area",

    "city",

    "state",

    "pincode",

  ];

  for (const field of requiredFields) {

    if (!address[field]) {

      throw new Error(
        `${field} is required.`
      );

    }

  }

};

// ======================================================
// Coupon Validation
// ======================================================

const applyCoupon =
async (
  couponCode,
  cartTotal
) => {

  if (!couponCode) {

    return {

      coupon: null,

      discount: 0,

    };

  }

  const coupon =
    await CouponRepository.findOne({

      code:
        couponCode
          .trim()
          .toUpperCase(),

      isActive: true,

    });

  if (!coupon) {

    throw new Error(
      "Invalid coupon."
    );

  }

  if (

    coupon.expiryDate &&

    coupon.expiryDate < new Date()

  ) {

    throw new Error(
      "Coupon expired."
    );

  }

  if (

    coupon.minimumOrderAmount &&

    cartTotal <
      coupon.minimumOrderAmount

  ) {

    throw new Error(
      `Minimum order amount should be ₹${coupon.minimumOrderAmount}`
    );

  }

  if (

    coupon.usageLimit &&

    coupon.usedCount >=
      coupon.usageLimit

  ) {

    throw new Error(
      "Coupon usage limit exceeded."
    );

  }

  let discount = 0;

  if (
    coupon.discountType ===
    "Percentage"
  ) {

    discount =
      (cartTotal *
        coupon.discountValue) /
      100;

    if (

      coupon.maximumDiscount &&

      discount >
        coupon.maximumDiscount

    ) {

      discount =
        coupon.maximumDiscount;

    }

  } else {

    discount =
      coupon.discountValue;

  }

  return {

    coupon,

    discount,

  };

};
// ======================================================
// Inventory Validation (Enterprise)
// ======================================================

const validateInventory =
async (cart) => {

  for (const item of cart.items) {

    const product =
      await ProductRepository.findById(
        item.product._id
      );

    if (!product) {

      throw new Error(
        `${item.name} does not exist.`
      );

    }

    if (!product.isActive) {

      throw new Error(
        `${item.name} is unavailable.`
      );

    }

    if (
      product.inventory.availableStock <= 0
    ) {

      throw new Error(
        `${item.name} is out of stock.`
      );

    }

    if (
      product.inventory.availableStock <
      item.quantity
    ) {

      throw new Error(
        `${item.name} has only ${product.inventory.availableStock} item(s) available.`
      );

    }

  }

};

// ======================================================
// Create Order
// ======================================================

export const createOrder =
async (
  customerId,
  payload,
  context
) => {

  const dto =
    OrderDTO.create(payload);

  const session =
    await mongoose.startSession();

  session.startTransaction();

  try {

    // =====================================
    // Load Cart
    // =====================================

    const cart =
      await CartRepository.findOne(

        {
          customer: customerId,
        },

        {
          populate: "items.product",
          session,
        }

      );

    validateCart(cart);

    validateShippingAddress(
      dto.shippingAddress
    );

    await validateInventory(
      cart
    );

    // =====================================
    // Coupon
    // =====================================

    const {

      coupon,

      discount,

    } = await applyCoupon(

      dto.couponCode,

      cart.totalAmount

    );

    // =====================================
    // Pricing
    // =====================================

    const shippingCharge =
      dto.shippingCharge ?? 0;

    const gst =
      dto.gst ?? 0;

    const finalAmount =

      cart.totalAmount -

      discount +

      shippingCharge +

      gst;

    // =====================================
    // Order Number
    // =====================================

    const orderNumber =
      await generateOrderNumber();

    // =====================================
    // Reserve Inventory
    // =====================================

    for (const item of cart.items) {

      const updated =
        await ProductRepository.findOneAndUpdate(

          {

            _id: item.product._id,

            "inventory.availableStock": {
              $gte: item.quantity,
            },

            isActive: true,

          },

          {

            $inc: {

              "inventory.reservedStock":
                item.quantity,

              "inventory.availableStock":
                -item.quantity,

            },

          },

          {

            new: true,

            session,

          }

        );

      if (!updated) {

        throw new Error(
          `${item.name} is out of stock.`
        );

      }

    }

    // =====================================
    // Create Order
    // =====================================

    const order =
      await OrderRepository.create(

        {

          orderNumber,

          customer: customerId,

          items: cart.items,

          shippingAddress:
            dto.shippingAddress,

          paymentMethod:
            dto.paymentMethod,

          subtotal:
            cart.totalAmount,

          discount,

          shippingCharge,

          gst,

          totalAmount:
            finalAmount,

          coupon:
            coupon?._id ?? null,

          paymentStatus:

            dto.paymentMethod ===
            "COD"

              ? "Pending"

              : "Verification Pending",

          orderStatus:
            "Pending",

        },

        {

          session,

        }

      );
          // =====================================
    // Coupon Usage
    // =====================================

    if (coupon) {

      coupon.usedCount += 1;

      await coupon.save({

        session,

      });

    }

    // =====================================
    // Clear Cart
    // =====================================

    cart.items = [];

    cart.totalAmount = 0;

    await cart.save({

      session,

    });

    // =====================================
    // Audit Log
    // =====================================

    await AuditService.log({

      entityType: "Order",

      entityId: order._id,

      action: "CREATE",

      performedBy: customerId,

      changes: [

        {

          field: "CREATE",

          oldValue: null,

          newValue: {

            orderNumber,

            totalAmount: finalAmount,

            paymentMethod:
              dto.paymentMethod,

          },

        },

      ],

      ipAddress:
        context.ipAddress,

      userAgent:
        context.userAgent,

      requestId:
        context.requestId,

    });

    // =====================================
    // Commit Transaction
    // =====================================

    await session.commitTransaction();

    session.endSession();

    return order;

  } catch (error) {

    await session.abortTransaction();

    session.endSession();

    throw error;

  }

};

// ======================================================
// Customer Orders
// ======================================================

export const getCustomerOrders =
async (customerId) => {

  return await OrderRepository.find(

    {

      customer: customerId,

    },

    {

      populate: [

        "customer",

        "items.product",

      ],

      sort: {

        createdAt: -1,

      },

    }

  );

};

// ======================================================
// Get Single Order
// ======================================================

export const getOrderById =
async (
  customerId,
  orderId
) => {

  const order =
    await OrderRepository.findOne(

      {

        _id: orderId,

        customer: customerId,

      },

      {

        populate: [

          "customer",

          "items.product",

        ],

      }

    );

  if (!order) {

    throw new Error(
      "Order not found."
    );

  }

  return order;

};

// ======================================================
// Admin Orders
// ======================================================

export const getAllOrders =
async () => {

  return await OrderRepository.find(

    {},

    {

      populate: [

        "customer",

        "items.product",

      ],

      sort: {

        createdAt: -1,

      },

    }

  );

};
// ======================================================
// Update Order Status
// ======================================================

export const updateOrderStatus =
async (
  orderId,
  status,
  context
) => {

  const session =
    await mongoose.startSession();

  session.startTransaction();

  try {

    const order =
      await OrderRepository.findById(
        orderId,
        {
          session,
        }
      );

    if (!order) {

      throw new Error(
        "Order not found."
      );

    }

    const oldOrder =
      order.toObject();

    // =====================================
    // Delivered
    // =====================================

    if (
      status === "Delivered"
    ) {

      for (const item of order.items) {

        const updated =
          await ProductRepository.findOneAndUpdate(

            {

              _id: item.product,

              "inventory.reservedStock": {
                $gte: item.quantity,
              },

            },

            {

              $inc: {

                stock:
                  -item.quantity,

                "inventory.reservedStock":
                  -item.quantity,

              },

            },

            {

              new: true,

              session,

            }

          );

        if (!updated) {

          throw new Error(
            `Inventory mismatch for ${item.name}`
          );

        }

      }

      order.deliveredAt =
        new Date();

      if (
        order.paymentMethod ===
        "COD"
      ) {

        order.paymentStatus =
          "Paid";

      }

    }

    // =====================================
    // Cancelled
    // =====================================

    if (
      status === "Cancelled"
    ) {

      for (const item of order.items) {

        await ProductRepository.findOneAndUpdate(

          {

            _id: item.product,

          },

          {

            $inc: {

              "inventory.reservedStock":
                -item.quantity,

              "inventory.availableStock":
                item.quantity,

            },

          },

          {

            session,

          }

        );

      }

      order.cancelledAt =
        new Date();

    }

    // =====================================
    // Update Status
    // =====================================

    order.orderStatus =
      status;

    await order.save({
      session,
    });

    // =====================================
    // Audit
    // =====================================

    const changes =
      getObjectDiff(
        oldOrder,
        order.toObject()
      );

    await AuditService.log({

      entityType: "Order",

      entityId:
        order._id,

      action:
        "STATUS_CHANGE",

      performedBy:
        context.adminId,

      changes,

      ipAddress:
        context.ipAddress,

      userAgent:
        context.userAgent,

      requestId:
        context.requestId,

    });

    await session.commitTransaction();

    session.endSession();

    return order;

  } catch (error) {

    await session.abortTransaction();

    session.endSession();

    throw error;

  }

};

// ======================================================
// Tracking Update
// ======================================================

export const updateTracking =
async (

  orderId,

  trackingNumber,

  courierPartner,

  estimatedDeliveryDate,

  context

) => {

  const order =
    await OrderRepository.findById(
      orderId
    );

  if (!order) {

    throw new Error(
      "Order not found."
    );

  }

  const oldOrder =
    order.toObject();

  order.trackingNumber =
    trackingNumber;

  order.courierPartner =
    courierPartner;

  order.estimatedDeliveryDate =
    estimatedDeliveryDate;

  if (
    order.orderStatus ===
    "Processing"
  ) {

    order.orderStatus =
      "Shipped";

  }

  await order.save();
    // =====================================
  // Audit Log
  // =====================================

  const changes =
    getObjectDiff(
      oldOrder,
      order.toObject()
    );

  await AuditService.log({

    entityType: "Order",

    entityId: order._id,

    action: "TRACKING_UPDATE",

    performedBy: context.adminId,

    changes,

    ipAddress: context.ipAddress,

    userAgent: context.userAgent,

    requestId: context.requestId,

  });

  return order;

};

// ======================================================
// Customer Cancel Order
// ======================================================

export const cancelOrder =
async (
  customerId,
  orderId,
  reason,
  context
) => {

  const session =
    await mongoose.startSession();

  session.startTransaction();

  try {

    const order =
      await OrderRepository.findOne(

        {

          _id: orderId,

          customer: customerId,

        },

        {

          session,

        }

      );

    if (!order) {

      throw new Error(
        "Order not found."
      );

    }

    if (

      !["Pending","Confirmed"]
      .includes(order.orderStatus)

    ) {

      throw new Error(
        "Order cannot be cancelled."
      );

    }

    const oldOrder =
      order.toObject();

    // =====================================
    // Restore Reserved Inventory
    // =====================================

    for (const item of order.items) {

      await ProductRepository.findOneAndUpdate(

        {

          _id: item.product,

        },

        {

          $inc: {

            "inventory.reservedStock":
              -item.quantity,

            "inventory.availableStock":
              item.quantity,

          },

        },

        {

          session,

        }

      );

    }

    order.orderStatus =
      "Cancelled";

    order.cancelReason =
      reason;

    order.cancelledAt =
      new Date();

    await order.save({

      session,

    });

    // =====================================
    // Audit
    // =====================================

    const changes =
      getObjectDiff(

        oldOrder,

        order.toObject()

      );

    await AuditService.log({

      entityType: "Order",

      entityId: order._id,

      action: "CUSTOMER_CANCEL",

      performedBy: customerId,

      changes,

      ipAddress: context.ipAddress,

      userAgent: context.userAgent,

      requestId: context.requestId,

    });

    await session.commitTransaction();

    session.endSession();

    return order;

  } catch (error) {

    await session.abortTransaction();

    session.endSession();

    throw error;

  }

};

// ======================================================
// Order Statistics
// ======================================================

export const getOrderStatistics =
async () => {

  const [

    totalOrders,

    pendingOrders,

    confirmedOrders,

    processingOrders,

    shippedOrders,

    deliveredOrders,

    cancelledOrders,

  ] = await Promise.all([

    OrderRepository.count({}),

    OrderRepository.count({
      orderStatus: "Pending",
    }),

    OrderRepository.count({
      orderStatus: "Confirmed",
    }),

    OrderRepository.count({
      orderStatus: "Processing",
    }),

    OrderRepository.count({
      orderStatus: "Shipped",
    }),

    OrderRepository.count({
      orderStatus: "Delivered",
    }),

    OrderRepository.count({
      orderStatus: "Cancelled",
    }),

  ]);

  return {

    totalOrders,

    pendingOrders,

    confirmedOrders,

    processingOrders,

    shippedOrders,

    deliveredOrders,

    cancelledOrders,

  };

};