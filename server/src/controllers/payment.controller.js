import asyncHandler from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";

import {
  submitPayment,
  getPendingPayments,
  verifyPayment,
  rejectPayment,
} from "../services/payment.service.js";

// ======================================
// Customer Submit Payment
// ======================================

export const submit = asyncHandler(async (req, res) => {
  const { orderId, transactionId } = req.body;

  const order = await submitPayment(
    req.user._id,
    orderId,
    transactionId
  );

  return res.status(200).json(
    apiResponse.success(
      "Payment submitted successfully. Waiting for admin verification.",
      order
    )
  );
});

// ======================================
// Admin Pending Payments
// ======================================

export const pending = asyncHandler(async (req, res) => {
  const payments = await getPendingPayments();

  return res.status(200).json(
    apiResponse.success(
      "Pending payments fetched successfully.",
      payments
    )
  );
});

// ======================================
// Admin Verify Payment
// ======================================

export const verify = asyncHandler(async (req, res) => {
  const order = await verifyPayment(
    req.params.id,
    req.user._id
  );

  return res.status(200).json(
    apiResponse.success(
      "Payment verified successfully.",
      order
    )
  );
});

// ======================================
// Admin Reject Payment
// ======================================

export const reject = asyncHandler(async (req, res) => {
  const { remark } = req.body;
  
const order = await rejectPayment(
  req.params.id,
  remark,
  req.user._id
);

  return res.status(200).json(
    apiResponse.success(
      "Payment rejected successfully.",
      order
    )
  );
});