import asyncHandler from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";

import {
  submitPayment,
  getPendingPayments,
  verifyPayment,
  rejectPayment,
  getPhonePePaymentStatus,
  handlePhonePeCallback,
  getPaymentHistory,
  getPaymentDetails,
  initiatePhonePePayment,
} from "../services/payment.service.js";


// ======================================
// PhonePe Callback
// ======================================

export const phonePeCallback =
  asyncHandler(async (req, res) => {

    const authorization =
      req.headers.authorization ||
      req.headers.Authorization;

    const data =
      await handlePhonePeCallback(
        authorization,
        req.body
      );

    return res.status(200).json(
      apiResponse.success(
        "PhonePe callback processed successfully.",
        data
      )
    );
  });

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

// ======================================
// Customer Payment History
// ======================================

export const history = asyncHandler(async (req, res) => {
  const payments = await getPaymentHistory(
    req.user._id
  );

  return res.status(200).json(
    apiResponse.success(
      "Payment history fetched successfully.",
      payments
    )
  );
});

// ======================================
// Payment Details
// ======================================

export const paymentDetails = asyncHandler(async (req, res) => {
  const payment = await getPaymentDetails(
    req.params.id,
    req.user
  );

  return res.status(200).json(
    apiResponse.success(
      "Payment details fetched successfully.",
      payment
    )
  );
});

// ======================================
// PhonePe Initiate Payment
// ======================================

export const initiatePhonePe = asyncHandler(
  async (req, res) => {

    const payment =
      await initiatePhonePePayment(
        req.user._id,
        req.body.orderId
      );

    return res.status(200).json(
      apiResponse.success(
        "PhonePe payment initiated successfully.",
        payment
      )
    );
  }
);

export const phonePePaymentStatus =
  asyncHandler(async (req, res) => {
    const data =
      await getPhonePePaymentStatus(
        req.user._id,
        req.params.orderId
      );

    return res.status(200).json(
      apiResponse.success(
        "Payment status fetched successfully.",
        data
      )
    );
  });