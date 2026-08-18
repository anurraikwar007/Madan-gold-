import express from "express";
import mongoose from "mongoose";
import OrderController from "../controllers/order.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import validate from "../middleware/validate.js";
import {
  createOrderSchema,
} from "../validators/order.validator.js";


const router = express.Router();

const validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid order id.",
    });
  }

  next();
};

/*
=========================================
Customer Routes
=========================================
*/

router.post(
  "/",
  authMiddleware,
  roleMiddleware("Customer"),
  validate(createOrderSchema),
  OrderController.create
);


router.get(
  "/my-orders",
  authMiddleware,
  roleMiddleware("Customer"),
  OrderController.myOrders
);   

router.get(
  "/admin",
  authMiddleware,
  roleMiddleware(
    "Admin",
    "SuperAdmin"
  ),
  OrderController.getAll
);

router.patch(
  "/:id/status",
  authMiddleware,
  roleMiddleware(
    "Admin",
    "SuperAdmin"
  ),
  validateObjectId,
  OrderController.updateStatus
);

router.patch(
  "/:id/cancel",
  authMiddleware,
  roleMiddleware("Customer"),
  validateObjectId,
  OrderController.cancel
);

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("Customer"),
  validateObjectId,
  OrderController.getOne
);

router.get(
  "/:id/invoice",
  authMiddleware,
  roleMiddleware(
    "Customer",
    "Admin",
    "SuperAdmin"
  ),
  validateObjectId,
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
    roleMiddleware(
      "Admin",
      "SuperAdmin"
    ),
    validateObjectId,
    OrderController.updateStatus
  );

export default router;