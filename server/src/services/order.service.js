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
import { orderQueryDTO }from "../dto/orderQuery.dto.js";
import {calculateItemPricing,calculateShipping,calculateGrandTotal,} from "../utils/pricing.util.js";

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
 subtotal
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
    subtotal <
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
      (subtotal *
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
      product.isDeleted ||
      product.metal !== "Silver" ||
      product.purity !== "925 Silver"
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

    if (
      availableStock < item.quantity
    ) {
      throw new ApiError(
        409,
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
  const existingOrder =
    await OrderRepository.findOne({
      customer: customerId,
      idempotencyKey: dto.idempotencyKey,
    });

  if (existingOrder) {
    await session.abortTransaction();
    return existingOrder;
  }

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
        calculateItemPricing(
          item.product,
          item.quantity
        ).sellingPrice,
        metal: item.product.metal,

        purity: item.product.purity,

        weight: item.product.weight,
        }));

    // =====================================
    // Coupon Validation
    // =====================================

   const cartTotal =
   orderItems.reduce(
    (total, item) =>
      total +
      Number(item.price) *
        Number(item.quantity),
    0
  );

   const subtotal =
    Math.round(
    cartTotal * 100
   ) / 100;

      const {
        coupon,
        discount,
      } = await applyCoupon(
        dto.couponCode,
        subtotal
      );

      const shippingCharge =
      calculateShipping(subtotal);

  const pricing =
  cart.items.reduce(
    (totals, item) => {
      const itemPricing =
        calculateItemPricing(
          item.product,
          item.quantity
        );

      return {
        makingCharge:
          totals.makingCharge +
          itemPricing.makingCharge,

        gst:
          totals.gst +
          itemPricing.gst,
      };
    },
    {
      makingCharge: 0,
      gst: 0,
    }
  );

const makingCharge =
  pricing.makingCharge;

const gst =
  pricing.gst;

    const finalAmount =
    calculateGrandTotal({
      subtotal: subtotal,
      makingCharge,
      gst,
      shippingCharge,
      discount,
    });
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

          idempotencyKey:
            dto.idempotencyKey,

          items: orderItems,
          shippingAddress:
            dto.shippingAddress,

          paymentMethod:
            dto.paymentMethod,

          subtotal: cartTotal,

          makingCharge,

          discount,

          shippingCharge,

          gst,

          totalAmount:
            finalAmount,

          coupon:
            coupon?._id || null,

           paymentStatus: "Pending",

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

 export const getCustomerOrders = async (
  customerId,
  query = {}
) => {
  const page = Math.max(
    Number(query.page) || 1,
    1
  );

  const limit = Math.min(
    Math.max(
      Number(query.limit) || 10,
      1
    ),
    50
  );

  const filter = {
    customer: customerId,
  };

  return OrderRepository.paginate(
    filter,
    {
      page,
      limit,
      sort: {
        createdAt: -1,
        _id: -1,
      },
      populate: [
        {
          path: "items.product",
          select:
            "name slug images metal purity",
        },
      ],
    }
  ).then((result) => ({
    orders: result.items,
    pagination: result.pagination,
  }));
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

export const getAdminOrders = async (
  query
) => {
  const dto =
    orderQueryDTO(query);

  const filter = {};

  if (dto.status) {
    filter.orderStatus =
      dto.status;
  }

  if (dto.paymentStatus) {
    filter.paymentStatus =
      dto.paymentStatus;
  }

  if (dto.paymentMethod) {
    filter.paymentMethod =
      dto.paymentMethod;
  }

  if (dto.customerId) {
    filter.customer =
      dto.customerId;
  }

  if (dto.fromDate || dto.toDate) {
    filter.createdAt = {};

    if (dto.fromDate) {
      const from =
        new Date(dto.fromDate);

      if (!Number.isNaN(from.getTime())) {
        filter.createdAt.$gte = from;
      }
    }

    if (dto.toDate) {
      const to =
        new Date(dto.toDate);

      if (!Number.isNaN(to.getTime())) {
        to.setHours(
          23,
          59,
          59,
          999
        );

        filter.createdAt.$lte = to;
      }
    }

    if (
      Object.keys(filter.createdAt).length === 0
    ) {
      delete filter.createdAt;
    }
  }

  if (dto.search) {
    const escapedSearch =
      dto.search.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

    filter.$or = [
      {
        orderNumber: {
          $regex: escapedSearch,
          $options: "i",
        },
      },
      {
        transactionId: {
          $regex: escapedSearch,
          $options: "i",
        },
      },
    ];
  }

  const allowedSortFields = {
    createdAt: "createdAt",
    totalAmount: "totalAmount",
    orderStatus: "orderStatus",
    paymentStatus: "paymentStatus",
  };

  const sortField =
    allowedSortFields[dto.sortBy] ||
    "createdAt";

  return OrderRepository.paginate(
    filter,
    {
      page: dto.page,
      limit: dto.limit,

      sort: {
        [sortField]: dto.order,
        _id: dto.order,
      },

      populate: [
        {
          path: "customer",
          select:
            "name email phone",
        },
        {
          path: "items.product",
          select:
            "name slug images metal purity",
        },
      ],
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
          await ProductRepository.confirmInventory(
            item.product,
            item.quantity,
            session
          );

        if (!updated) {
          throw new ApiError(
            409,
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

            const restored =
            await ProductRepository.findOneAndUpdate(
              {
                _id: item.product,
                isDeleted: false,
                "inventory.reservedStock": {
                  $gte: item.quantity,
                },
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

          if (!restored) {
            throw new ApiError(
              409,
              `Inventory mismatch for ${item.name}.`
            );
          }

          }

      // =====================================
      // Coupon Rollback
      // =====================================

     if (order.coupon) {
      const updatedCoupon =
        await CouponRepository.decreaseUsage(
          order.coupon,
          session
        );

      if (!updatedCoupon) {
        throw new ApiError(
          409,
          "Coupon usage rollback failed."
        );
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
  ![
    "Processing",
    "Packed",
    "Shipped",
    "Out For Delivery",
    ].includes(order.orderStatus)
   ) {
   throw new ApiError(
    400,
    "Tracking cannot be updated for this order status."
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
      const updated =
        await ProductRepository.releaseInventory(
          item.product,
          item.quantity,
          session
        );

      if (!updated) {
        throw new ApiError(
          409,
          `Inventory mismatch for ${item.name}.`
        );
      }
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