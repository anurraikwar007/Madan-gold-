import express from "express";

import {
  submit,
  pending,
  verify,
  reject,
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
  roleMiddleware("Admin"),
  pending
);

// Verify Payment
router.put(
  "/:id/verify",
  authMiddleware,
  roleMiddleware("Admin"),
  verify
);

// Reject Payment
router.put(
  "/:id/reject",
  authMiddleware,
  roleMiddleware("Admin"),
  reject
);

export default router;