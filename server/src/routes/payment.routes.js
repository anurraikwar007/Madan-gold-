import express from "express";

import {
  submit,
  pending,
  verify,
  reject,
  history,
  paymentDetails,
} from "../controllers/payment.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

const router = express.Router();

/*
=========================================
Customer Routes
=========================================
*/

// Submit Payment (UTR)
router.post(
  "/submit",
  authMiddleware,
  roleMiddleware("Customer"),
  submit
);

/*
=========================================
Admin Routes
=========================================
*/

// Pending Payments
router.get(
  "/pending",
  authMiddleware,
  roleMiddleware("Admin","SuperAdmin"),
  pending
);

// Verify Payment
router.put(
  "/:id/verify",
  authMiddleware,
  roleMiddleware("Admin","SuperAdmin"),
  verify
);

// Reject Payment
router.put(
  "/:id/reject",
  authMiddleware,
  roleMiddleware("Admin","SuperAdmin"),
  reject
);

// Payment History (Customer)
router.get(
    "/history",
    authMiddleware,
    roleMiddleware("Customer"),
    history
);

// Payment Details
router.get(
    "/:id",
    authMiddleware,
    paymentDetails
);

export default router;