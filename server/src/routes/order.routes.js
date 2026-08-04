import express from "express";

import OrderController from "../controllers/order.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

const router = express.Router();

/*
=========================================
Customer Routes
=========================================
*/

router.post(
  "/",
  authMiddleware,
  roleMiddleware("Customer"),
  OrderController.create
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware("Customer"),
  OrderController.myOrders
);

router.get(
  "/my-orders",
  authMiddleware,
  roleMiddleware("Customer"),
  OrderController.myOrders
);

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("Customer"),
  OrderController.getOne
);

router.get(
  "/:id/invoice",
  authMiddleware,
  OrderController.downloadInvoice
);

/*
=========================================
Admin Routes
=========================================
*/

router.get(
  "/admin/all",
  authMiddleware,
  roleMiddleware("Admin","SuperAdmin"),
  OrderController.getAll
);

router.put(
  "/admin/:id/status",
  authMiddleware,
  roleMiddleware("Admin","SuperAdmin"),
  OrderController.updateStatus
);

export default router;