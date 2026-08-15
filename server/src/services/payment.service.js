import mongoose from "mongoose";

import OrderRepository from "../repositories/order.repository.js";
import ProductRepository from "../repositories/product.repository.js";

import AuditService from "./audit.service.js";

import ApiError from "../utils/apiError.js";

import Order from "../models/order.model.js";
import CouponRepository from "../repositories/coupon.repository.js";

import {
  StandardCheckoutPayRequest,
} from "@phonepe-pg/pg-sdk-node";

import { getPhonePeClient } from "../config/phonepe.js";
import { env } from "../config/env.js";

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
      // Coupon Rollback
      // =====================================

      if (order.coupon) {

        const couponRestored =
          await CouponRepository.decreaseUsage(
            order.coupon,
            session
          );

        if (!couponRestored) {
          throw new ApiError(
            409,
            "Coupon usage rollback failed."
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

 if (
      !["Admin", "SuperAdmin"].includes(
        user.role
      )
    ) {
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

// ======================================================
// PhonePe - Initiate Payment
// ======================================================

export const initiatePhonePePayment = async (
  customerId,
  orderId
) => {

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new ApiError(
      400,
      "Invalid order id."
    );
  }

  const order =
    await OrderRepository.findOne({
      _id: orderId,
      customer: customerId,
    });

  if (!order) {
    throw new ApiError(
      404,
      "Order not found."
    );
  }

  if (
    order.paymentMethod !== "PHONEPE"
  ) {
    throw new ApiError(
      400,
      "This order is not a PhonePe order."
    );
  }

  if (
    order.orderStatus === "Cancelled"
  ) {
    throw new ApiError(
      400,
      "Cancelled order cannot be paid."
    );
  }

  if (
    order.paymentStatus === "Paid"
  ) {
    throw new ApiError(
      400,
      "Order is already paid."
    );
  }

  if (
    order.paymentRedirectUrl &&
    order.phonePeMerchantOrderId &&
    order.paymentStatus === "Pending"
  ) {
    return {
      orderId: order._id,
      orderNumber: order.orderNumber,
      paymentStatus: order.paymentStatus,
      paymentUrl: order.paymentRedirectUrl,
    };
  }

  const merchantOrderId =
    order.orderNumber;

  const amount =
    Math.round(
      Number(order.totalAmount) * 100
    );

  if (!Number.isInteger(amount) || amount <= 0) {
    throw new ApiError(
      400,
      "Invalid order amount."
    );
  }

  const request =
    StandardCheckoutPayRequest.builder()
      .merchantOrderId(
        merchantOrderId
      )
      .amount(amount)
      .redirectUrl(
        env.PHONEPE_REDIRECT_URL
      )
      .build();

  let response;

  try {
    const client =
      getPhonePeClient();

    response =
      await client.pay(request);

  } catch (error) {

    console.error(
      "PhonePe payment initiation failed:",
      error
    );

    throw new ApiError(
      502,
      "Unable to initiate PhonePe payment."
    );
  }

  if (!response?.redirectUrl) {
    throw new ApiError(
      502,
      "PhonePe did not return a payment URL."
    );
  }

  order.phonePeMerchantOrderId =
    merchantOrderId;

  order.phonePeOrderId =
    response.orderId ||
    "";

  order.paymentRedirectUrl =
    response.redirectUrl;

  order.phonePeState =
    response.state ||
    "PENDING";

  order.paymentStatus =
    "Pending";

  await order.save();

  return {
    orderId: order._id,
    orderNumber:
      order.orderNumber,
    paymentStatus:
      order.paymentStatus,
    paymentUrl:
      order.paymentRedirectUrl,
  };
};

// ======================================================
// PhonePe Failed Payment Handler
// ======================================================

const handlePhonePePaymentFailure = async (
  order
) => {

  const session =
    await mongoose.startSession();

  session.startTransaction();

  try {

    const freshOrder =
      await OrderRepository.findById(
        order._id,
        {
          session,
          lean: false,
        }
      );

    if (!freshOrder) {
      throw new ApiError(
        404,
        "Order not found."
      );
    }

    // Already processed
    if (
      freshOrder.paymentStatus ===
      "Rejected"
    ) {
      await session.commitTransaction();
      session.endSession();

      return freshOrder;
    }

    // ==========================================
    // Release Reserved Inventory
    // ==========================================

    for (const item of freshOrder.items) {

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

      if (!updated) {
        throw new ApiError(
          409,
          `Inventory release failed for ${item.product}.`
        );
      }
    }

    // ==========================================
    // Restore Coupon
    // ==========================================

    if (freshOrder.coupon) {

      const restored =
        await CouponRepository.decreaseUsage(
          freshOrder.coupon,
          session
        );

      if (!restored) {
        throw new ApiError(
          409,
          "Coupon usage rollback failed."
        );
      }
    }

    // ==========================================
    // Update Order
    // ==========================================

    freshOrder.paymentStatus =
      "Rejected";

    freshOrder.orderStatus =
      "Cancelled";

    freshOrder.paymentRemark =
      "PhonePe payment failed.";

    freshOrder.cancelReason =
      "PhonePe payment failed.";

    freshOrder.cancelledAt =
      new Date();

    await freshOrder.save({
      session,
    });

    // ==========================================
    // Audit
    // ==========================================

    await AuditService.log({
      entityType: "Payment",
      entityId: freshOrder._id,
      action: "PHONEPE_PAYMENT_FAILED",

      performedBy:
        freshOrder.customer,

      performedByModel:
        "Customer",

      changes: [
        {
          field: "paymentStatus",
          oldValue:
            "Pending",
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

    return freshOrder;

  } catch (error) {

    await session.abortTransaction();

    session.endSession();

    throw error;
  }
};

//=========================================================
//PhonePe- PaymentStatus
//=========================================================

export const getPhonePePaymentStatus = async (
  customerId,
  orderId
) => {
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new ApiError(
      400,
      "Invalid order id."
    );
  }

  const order =
    await OrderRepository.findOne({
      _id: orderId,
      customer: customerId,
    });

  if (!order) {
    throw new ApiError(
      404,
      "Order not found."
    );
  }

  if (order.paymentMethod !== "PHONEPE") {
    throw new ApiError(
      400,
      "This order is not a PhonePe order."
    );
  }

  if (!order.phonePeMerchantOrderId) {
    throw new ApiError(
      400,
      "PhonePe payment has not been initiated."
    );
  }

  if (order.paymentStatus === "Paid") {
    return {
      orderId: order._id,
      orderNumber: order.orderNumber,
      paymentStatus: "Paid",
      orderStatus: order.orderStatus,
      phonePeState: order.phonePeState,
      transactionId:
        order.phonePeTransactionId || "",
    };
  }

  if (order.orderStatus === "Cancelled") {
    throw new ApiError(
      400,
      "Cancelled order payment cannot be checked."
    );
  }

  const client = getPhonePeClient();

  let response;

  try {
    response =
      await client.getOrderStatus(
        order.phonePeMerchantOrderId
      );
  } catch (error) {
    console.error(
      "PhonePe status check failed:",
      error
    );

    throw new ApiError(
      502,
      "Unable to check PhonePe payment status."
    );
  }

  const state =
    String(
      response?.state || ""
    ).toUpperCase();

  const transactionId =
    response?.paymentDetails?.[0]
      ?.transactionId || "";

  order.phonePeState = state;

  if (transactionId) {
    order.phonePeTransactionId =
      transactionId;
  }

  // ==========================================
  // PAYMENT SUCCESS
  // ==========================================

  if (state === "COMPLETED") {
    order.paymentStatus = "Paid";

    order.paymentVerifiedAt =
      new Date();

    if (
      order.orderStatus === "Pending"
    ) {
      order.orderStatus =
        "Confirmed";
    }

    order.paymentRemark =
      "PhonePe payment successful.";
  }

  // ==========================================
  // PAYMENT FAILED
  // ==========================================

 else if (
  state === "FAILED"
) {

  const failedOrder =
    await handlePhonePePaymentFailure(
      order
    );

  return {
    orderId:
      failedOrder._id,

    orderNumber:
      failedOrder.orderNumber,

    paymentStatus:
      failedOrder.paymentStatus,

    orderStatus:
      failedOrder.orderStatus,

    phonePeState:
      failedOrder.phonePeState,

    transactionId:
      failedOrder.phonePeTransactionId ||
      "",
  };
}

  // ==========================================
  // PAYMENT PENDING
  // ==========================================

  else {
    order.paymentStatus =
      "Pending";
  }

  await order.save();

  return {
    orderId: order._id,
    orderNumber:
      order.orderNumber,
    paymentStatus:
      order.paymentStatus,
    orderStatus:
      order.orderStatus,
    phonePeState:
      state,
    transactionId,
  };
};

// ======================================================
// PhonePe Callback
// ======================================================

export const handlePhonePeCallback = async (
  authorization,
  body
) => {

  if (
    !env.PHONEPE_CALLBACK_USERNAME ||
    !env.PHONEPE_CALLBACK_PASSWORD
  ) {
    throw new ApiError(
      503,
      "PhonePe callback credentials are not configured."
    );
  }

  if (!authorization) {
    throw new ApiError(
      401,
      "PhonePe callback authorization is missing."
    );
  }

  const client =
    getPhonePeClient();

  let callback;

  try {

    callback =
      await client.validateCallback(
        env.PHONEPE_CALLBACK_USERNAME,
        env.PHONEPE_CALLBACK_PASSWORD,
        authorization,
        JSON.stringify(body)
      );

  } catch (error) {

    console.error(
      "PhonePe callback validation failed:",
      error
    );

    throw new ApiError(
      401,
      "Invalid PhonePe callback."
    );
  }

  if (!callback) {
    throw new ApiError(
      401,
      "Invalid PhonePe callback."
    );
  }

  const merchantOrderId =
    body?.payload?.merchantOrderId ||
    body?.data?.merchantOrderId ||
    body?.merchantOrderId ||
    null;

  if (!merchantOrderId) {
    throw new ApiError(
      400,
      "PhonePe merchant order ID is missing."
    );
  }

  const order =
    await OrderRepository.findOne({
      phonePeMerchantOrderId:
        merchantOrderId,
  });

  if (!order) {
    throw new ApiError(
      404,
      "Order linked to PhonePe callback not found."
    );
  }

  // ==========================================
  // IMPORTANT:
  // Do NOT trust callback status directly.
  // Verify using PhonePe Status API.
  // ==========================================

  const response =
    await client.getOrderStatus(
      merchantOrderId
    );

  const state =
    String(
      response?.state || ""
    ).toUpperCase();

  const transactionId =
    response?.paymentDetails?.[0]
      ?.transactionId || "";

  order.phonePeState =
    state;

  if (transactionId) {
    order.phonePeTransactionId =
      transactionId;
  }

  // ==========================================
  // SUCCESS
  // ==========================================

  if (state === "COMPLETED") {

    order.paymentStatus =
      "Paid";

    order.paymentVerifiedAt =
      new Date();

    order.paymentRemark =
      "PhonePe payment successful.";

    if (
      order.orderStatus ===
      "Pending"
    ) {
      order.orderStatus =
        "Confirmed";
    }

    await order.save();

  }

  // ==========================================
  // FAILED
  // ==========================================

  else if (
    state === "FAILED"
  ) {

    await handlePhonePePaymentFailure(
      order
    );

  }

  // ==========================================
  // PENDING
  // ==========================================

  else {

    order.paymentStatus =
      "Pending";

    await order.save();
  }

  return {
    orderId:
      order._id,

    orderNumber:
      order.orderNumber,

    paymentStatus:
      order.paymentStatus,

    orderStatus:
      order.orderStatus,

    phonePeState:
      state,

    transactionId,
  };
};
