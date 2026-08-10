import mongoose from "mongoose";

import OrderRepository from "../repositories/order.repository.js";
import ProductRepository from "../repositories/product.repository.js";

import AuditService from "./audit.service.js";

import ApiError from "../utils/apiError.js";

import Order from "../models/order.model.js";
import CouponRepository from "../repositories/coupon.repository.js";

// ======================================================
// Submit Payment
// ======================================================
 


export const submitPayment = async (
  customerId,
  orderId,
  transactionId
) => {
   
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new ApiError(400, "Invalid order id.");
   }

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
      order.paymentMethod === "COD"
    ) {
      throw new ApiError(
        400,
        "COD orders do not require payment submission."
      );
    }

    if (
  order.paymentStatus === "Paid"
    ) {
      throw new ApiError(
        400,
        "Payment already verified."
      );
    }

if (
  order.orderStatus === "Cancelled"
    ) {
      throw new ApiError(
        400,
        "Cancelled order cannot accept payment."
      );
    }

    if (!transactionId) {
      throw new ApiError(
        400,
        "Transaction ID is required."
      );
    }
      if (order.transactionId) {
    throw new ApiError(
        400,
        "Payment already submitted."
    );
   }
    // =====================================
    // Update Payment
    // =====================================

    order.transactionId =
      transactionId;

    order.paymentSubmittedAt =
      new Date();

    order.paymentStatus =
      "Verification Pending";

    await order.save({
      session,
    });

    // =====================================
    // Audit Log
    // =====================================

    await AuditService.log({
      entityType: "Payment",
      entityId: order._id,
      action: "PAYMENT_SUBMITTED",
      performedBy: customerId,
       performedByModel: "Customer",
      changes: [ 
        {
          field: "transactionId",
          oldValue: null,
          newValue: transactionId,
        },
      ],
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
// Get Pending Payments
// ======================================================

export const getPendingPayments =
async () => {

  return await OrderRepository.find(

    {
      paymentStatus:
        "Verification Pending",

      paymentMethod: {
        $ne: "COD",
      },
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
// Verify Payment
// ======================================================

export const verifyPayment = async (
  orderId,
  adminId
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
      order.paymentMethod === "COD"
    ) {
      throw new ApiError(
        400,
        "COD payment cannot be verified."
      );
    }
       if (!order.transactionId) {
      throw new ApiError(
        400,
        "Payment transaction ID is missing."
      );
    }
   if (
      order.paymentStatus !==
      "Verification Pending"
      ) {
  throw new ApiError(
    400,
    "Payment cannot be verified from the current payment state."
  );
}

  if (
      order.orderStatus === "Cancelled"
    ) {
      throw new ApiError(
        400,
        "Cancelled order payment cannot be verified."
      );
    }

    // =====================================
    // Update Payment
    // =====================================

    order.paymentStatus =
      "Paid";

    order.paymentVerifiedAt =
      new Date();

    order.paymentVerifiedBy =
      adminId;

    order.paymentRemark =
      "Payment Verified";

    if (
      order.orderStatus ===
      "Pending"
    ) {
      order.orderStatus =
        "Confirmed";
    }

    await order.save({
      session,
    });

    // =====================================
    // Audit
    // =====================================

    await AuditService.log({
      entityType: "Payment",
      entityId: order._id,
      action: "PAYMENT_VERIFIED",
      performedBy: adminId,
      performedByModel: "Admin",

      changes: [
        {
          field: "paymentStatus",
          oldValue:
            "Verification Pending",
          newValue: "Paid",
        },
      ],
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

  // =====================================
// Restore Coupon Usage
// =====================================



// ======================================================
// Reject Payment
// ======================================================

  export const rejectPayment = async (
    orderId,
    remark,
    adminId
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
        order.paymentMethod === "COD"
      ) {
        throw new ApiError(
          400,
          "COD payment cannot be rejected."
        );
      }

      if (
    order.paymentStatus !==
    "Verification Pending"
  ) {
    throw new ApiError(
      400,
      "Only pending payments can be rejected."
    );
  }

      if (
        order.orderStatus === "Cancelled"
      ) {
        throw new ApiError(
          400,
          "Cancelled order payment cannot be rejected again."
        );
      }

      // =====================================
      // Restore Reserved Stock
      // =====================================

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
                "inventory.reservedStock": -item.quantity,
                "inventory.availableStock": item.quantity,
              },
            },
            {
              session,
            }
          );

        if (!updated) {
          throw new ApiError(
            409,
            `Inventory mismatch for ${item.product}.`
          );
        }
      }

      // =====================================
      // Update Order
      // =====================================

      order.paymentStatus =
        "Rejected";

      order.orderStatus =
        "Cancelled";

        order.transactionId = 
        null;

      order.paymentSubmittedAt =
        null;

      order.paymentRemark =
        remark;

       order.paymentVerifiedBy = null;
       order.paymentVerifiedAt = null;

      order.cancelledAt =
        new Date();

      await order.save({
        session,
      });

      // =====================================
      // Audit
      // =====================================

      await AuditService.log({
        entityType: "Payment",
        entityId: order._id,
        action: "PAYMENT_REJECTED",
        performedBy: adminId,
        performedByModel: "Admin",

        changes: [
          {
            field: "paymentStatus",
            oldValue:
              "Verification Pending",
            newValue:
              "Rejected",
          },
          {
            field: "orderStatus",
            oldValue:
              "Pending",
            newValue:
              "Cancelled",
          },
        ],
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
// Check Payment Status
// ======================================================

export const getPaymentStatus = async (
  orderId
) => {

  const order =
    await OrderRepository.findById(
      orderId
    );

  if (!order) {
    throw new ApiError(
      404,
      "Order not found."
    );
  }

  return {

    orderId: order._id,

    orderNumber:
      order.orderNumber,

    paymentMethod:
      order.paymentMethod,

    paymentStatus:
      order.paymentStatus,

    transactionId:
      order.transactionId ?? null,

    paymentSubmittedAt:
      order.paymentSubmittedAt ?? null,

    paymentVerifiedAt:
      order.paymentVerifiedAt ?? null,

    paymentVerifiedBy:
      order.paymentVerifiedBy ?? null,

    remark:
      order.paymentRemark ?? null,

  };

};

// ======================================================
// Customer Payment History
// ======================================================

export const getPaymentHistory = async (
  customerId
) => {

  const orders =
    await Order.find({

      customer: customerId,

    })
      .select(
        "orderNumber paymentStatus paymentMethod paymentApp transactionId totalAmount paymentSubmittedAt paymentVerifiedAt createdAt"
      )
      .sort({
        createdAt: -1,
      });

  return orders;

};

// ======================================================
// Payment Details
// ======================================================

export const getPaymentDetails = async (
  orderId,
  user
) => {

  const query = {
    _id: orderId,
  };

  // Customer sirf apna payment dekh sakta hai

  if (user.role !== "Admin") {
    query.customer =
      user._id;
  }

  const order =
    await Order.findOne(query)
      .populate(
        "customer",
        "name email phone"
      )
      .populate(
        "paymentVerifiedBy",
        "name email"
      );

  if (!order) {
    throw new ApiError(
      404,
      "Payment not found."
    );
  }

  return order;

};

// ======================================================
// Payment Statistics
// ======================================================

export const getPaymentStatistics =
async () => {

  const [

    pending,

    paid,

    rejected,

  ] = await Promise.all([

    OrderRepository.count({

      paymentStatus:
        "Verification Pending",

    }),

    OrderRepository.count({

      paymentStatus:
        "Paid",

    }),

    OrderRepository.count({

      paymentStatus:
        "Rejected",

    }),

  ]);

  return {

    verificationPending:
      pending,

    paid,

    rejected,

    total:

      pending +

      paid +

      rejected,

  };

};