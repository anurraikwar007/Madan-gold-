import mongoose from "mongoose";

import OrderRepository from "../repositories/order.repository.js";
import CartRepository from "../repositories/cart.repository.js";
import CouponRepository from "../repositories/coupon.repository.js";
import ProductRepository from "../repositories/product.repository.js";

import AuditService from "./audit.service.js";

import { createOrderDTO } from "../dto/order.dto.js";

import { generateOrderNumber } from "../utils/orderNumber.js";
import { getObjectDiff } from "../utils/diff.util.js";

import ApiError from "../utils/apiError.js";
import { ORDER_STATUS } from "../constants/order.constant.js";
import { orderQueryDTO }
from "../dto/orderQuery.dto.js";

// ======================================================
// Private Helpers
// ======================================================

const validateCart = (cart) => {
  if (!cart) {
    throw new ApiError(404, "Cart not found.");
  }

  if (!cart.items || cart.items.length === 0) {
    throw new ApiError(400, "Your cart is empty.");
  }
};

// ======================================================
// Shipping Address Validation
// ======================================================

const validateShippingAddress = (address) => {
  if (!address) {
    throw new ApiError(
      400,
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
      throw new ApiError(
        400,
        `${field} is required.`
      );
    }
  }
};

// ======================================================
// Coupon Validation
// ======================================================

const applyCoupon = async (
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
      code: couponCode.trim().toUpperCase(),
      isActive: true,


     isDeleted:false,

    });

  if (!coupon) {
    throw new ApiError(
      400,
      "Invalid coupon."
    );
  }

   const now = new Date();

    if (
      (coupon.validFrom &&
        now < coupon.validFrom) ||
      (coupon.validTill &&
        now > coupon.validTill)
    ) {
      throw new ApiError(
        400,
        "Coupon is expired or not active yet."
      );
    }

  if (
    coupon.minimumOrderAmount &&
    cartTotal <
      coupon.minimumOrderAmount
  ) {
    throw new ApiError(
      400,
      `Minimum order amount should be ₹${coupon.minimumOrderAmount}`
    );
  }

  if (
    coupon.usageLimit &&
    coupon.usedCount >=
      coupon.usageLimit
  ) {
    throw new ApiError(
      400,
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
// Inventory Validation
// ======================================================

const validateInventory = async (
  cart,
  session
) => {
  for (const item of cart.items) {

    const product =
      await ProductRepository.findById(
        item.product._id,
        {
          session,
          lean: false,
        }
      );

    if (!product) {
      throw new ApiError(
        404,
        `${item.product.name} does not exist.`
      );
    }

    if (
      !product.isActive ||
      product.isDeleted
    ) {
      throw new ApiError(
        400,
        `${product.name} is no longer available.`
      );
    }

    const availableStock =
      Number(
        product.inventory?.availableStock || 0
      );

    if (availableStock <= 0) {
      throw new ApiError(
        400,
        `${product.name} is unavailable.`
      );
    }

    if (
      availableStock < item.quantity
    ) {
      throw new ApiError(
        400,
        `${product.name} has only ${availableStock} item(s) available.`
      );
    }
  }
};


// ======================================================
// Create Order
// ======================================================

export const createOrder = async (
  customerId,
  payload,
  context
) => {

  const dto =
    createOrderDTO(payload);

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
      lean: false,   // <-- YE LINE ADD KARO
    }

  );
    validateCart(cart);

    validateShippingAddress(
      dto.shippingAddress
    );

    await validateInventory(
      cart,
      session
    );

    const orderItems = cart.items.map((item) => ({
  product: item.product._id,

  name: item.product.name,

  image:
    item.product.images?.find((img) => img.isPrimary)?.url ||
    item.product.images?.[0]?.url ||
    "",

  quantity: item.quantity,

    price:
    item.product.discountPrice > 0 &&
    item.product.discountPrice <
    item.product.price
    ? item.product.discountPrice
    : item.product.price,

  metal: item.product.metal,

  purity: item.product.purity,

  weight: item.product.weight,
   }));

    // =====================================
    // Coupon Validation
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

    const cartTotal =
    cart.totalAmount;

   const shippingCharge =
    cartTotal < 1000
    ? 100
    : 0;

  const gst =
    cart.items.reduce(
      (total, item) => {

        const itemProduct =
          item.product;

        const itemPrice =
        item.product.discountPrice > 0 &&
        item.product.discountPrice <
          item.product.price
          ? item.product.discountPrice
          : item.product.price;

          const itemMakingCharges =
          (itemProduct.makingCharges || 0) *
          item.quantity;

        const itemTaxableAmount =
          (
            itemPrice *
            item.quantity
          ) +
          itemMakingCharges;

      const itemGST =
        itemTaxableAmount *
        (
          (itemProduct.gst ?? 0) /
          100
        );

      return total + itemGST;

    },
    0
  );

    const finalAmount = Math.max(
       0,
       cart.totalAmount -
        discount +
        shippingCharge +
        gst
    );

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

            isActive: true,

            "inventory.availableStock": {
              $gte: item.quantity,
            },

          },

          {

            $inc: {

              "inventory.availableStock":
                -item.quantity,

              "inventory.reservedStock":
                item.quantity,

            },

          },

          {

             

            session,

          }

        );

      if (!updated) {

        throw new ApiError(

          400,

          `${item.product.name} is out of stock.`


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

          items: orderItems,

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
            coupon?._id || null,

          paymentStatus:

            dto.paymentMethod === "COD"

              ? "Pending"

              : "Verification Pending",

          orderStatus:
            "Pending",

        },

        {

          session,

        }
           
      );      console.log(JSON.stringify(orderItems, null, 2));
          // =====================================
    // Coupon Usage
    // =====================================

    if (coupon) {

    const updatedCoupon =
      await CouponRepository.increaseUsage(
        coupon._id,
        session
      );

    if (!updatedCoupon) {
      throw new ApiError(
        409,
        "Coupon usage limit exceeded."
      );
    }

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

            orderStatus:
              "Pending",

          },

        },

      ],

      ipAddress:
        context.ipAddress,

      userAgent:
        context.userAgent,

      requestId:
        context.requestId,


        performedByModel:
          "Customer",

        session,

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

  return  OrderRepository.find(

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

    throw new ApiError(

      404,

      "Order not found."

    );

  }

  return order;

};

 //

  export const getAdminOrderById =
    async (orderId) => {

      const order =
        await OrderRepository.findOne(
          {
            _id: orderId,
          },
          {
            populate: [
              "customer",
              "items.product",
            ],
          }
        );

      if (!order) {
        throw new ApiError(
          404,
          "Order not found."
        );
      }

      return order;
    };

// ======================================================
// Admin Orders
// ======================================================

export const getAdminOrders = async (query) => {

    const dto = orderQueryDTO(query);

    const filter = {};

    if (dto.status) {
        filter.orderStatus = dto.status;
    }

    if (dto.paymentStatus) {
        filter.paymentStatus = dto.paymentStatus;
    }

    if (dto.customerId) {
        filter.customer = dto.customerId;
    }

    if (dto.search) {
        filter.$or = [
            {
                orderNumber: {
                    $regex: dto.search,
                    $options: "i",
                },
            },
            {
                transactionId: {
                    $regex: dto.search,
                    $options: "i",
                },
            },
        ];
    }

    return OrderRepository.paginate(filter, {
        page: dto.page,
        limit: dto.limit,
        sort: {
            createdAt: -1,
        },
        populate: [
            "customer",
            "items.product",
        ],
    });

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
          lean: false,

        }

      );

    if (!order) {

      throw new ApiError(

        404,

        "Order not found."

      );

    }

    // =====================================
    // Status Transition Validation
    // =====================================

    const allowed =
     ORDER_STATUS[order.orderStatus] 
     || [];

    if (
      !allowed.includes(status)
    ) {

      throw new ApiError(

        400,

        `Cannot change order from ${order.orderStatus} to ${status}`

      );

    }

    // =====================================
    // Delivered Order Protection
    // =====================================

    if (

      order.orderStatus ===
      "Delivered" &&

      status === "Cancelled"

    ) {

      throw new ApiError(

        400,

        "Delivered order cannot be cancelled."

      );

    }

    const oldOrder =
      order.toObject();
    // =====================================
    // Delivered
    // =====================================

    if (status === "Delivered") {

      for (const item of order.items) {

        const updated =
       await ProductRepository.findOneAndUpdate(

        {
            _id: item.product,
        },

        {
            $inc: {
                "inventory.stock": -item.quantity,
                "inventory.reservedStock": -item.quantity,
            },
        },

        {
            new: true,
            session,
        }

    );

        if (!updated) {

          throw new ApiError(

            400,

            `Inventory mismatch for ${item.name}`

          );

        }

      }

      order.deliveredAt =
        new Date();

      if (
        order.paymentMethod === "COD"
      ) {

        order.paymentStatus =
          "Paid";

      }

    }

    // =====================================
    // Cancelled
    // =====================================

    if (status === "Cancelled") {

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

      // =====================================
      // Coupon Rollback
      // =====================================

      if (order.coupon) {

        const coupon =
          await CouponRepository.findById(
            order.coupon
          );

        if (coupon && coupon.usedCount > 0) {

          coupon.usedCount -= 1;

          await coupon.save({
            session,
          });

        }

      }

      order.cancelledAt =
        new Date();

    }  
      
      

    // =====================================
   // Payment Validation
   // =====================================

      if (
        status === "Delivered" &&
        order.paymentMethod !== "COD" &&
        order.paymentStatus !== "Paid"
      ) {
        throw new ApiError(
          400,
          "Order cannot be delivered before payment is verified."
        );
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

        session,

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

export const updateTracking = async (
  orderId,
  trackingNumber,
  courierPartner,
  estimatedDeliveryDate,
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
          lean: false,
        }
      );

    if (!order) {
      throw new ApiError(
        404,
        "Order not found."
      );
    }

    if (
      order.orderStatus !==
      "Processing"
    ) {
      throw new ApiError(
        400,
        "Tracking can only be updated for Processing orders."
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

    order.orderStatus =
      "Shipped";

    await order.save({
      session,
    });

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
      session,
    });

    await session.commitTransaction();

    return order;

  } catch (error) {

    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    throw error;

  } finally {

    await session.endSession();

  }
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

      throw new ApiError(

        404,

        "Order not found."

      );

    }

    // Delivered order cancel nahi hogi

    if (
      order.orderStatus ===
      "Delivered"
    ) {

      throw new ApiError(

        400,

        "Delivered order cannot be cancelled."

      );

    }

    // Sirf Pending / Confirmed cancel

    if (

      ![
        "Pending",
        "Confirmed",
      ].includes(
        order.orderStatus
      )

    ) {

      throw new ApiError(

        400,

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

    // =====================================
    // Coupon Rollback
    // =====================================

    if (order.coupon) {

      const coupon =
        await CouponRepository.findById(
          order.coupon
        );

      if (
        coupon &&
        coupon.usedCount > 0
      ) {

        coupon.usedCount -= 1;

        await coupon.save({
          session,
        });

      }

    }

    // =====================================
    // Update Order
    // =====================================

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

      entityId:
        order._id,

      action:
        "CUSTOMER_CANCEL",

      performedBy:
        customerId,

      changes,

      ipAddress:
        context.ipAddress,

      userAgent:
        context.userAgent,

      requestId:
        context.requestId,

        session,

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