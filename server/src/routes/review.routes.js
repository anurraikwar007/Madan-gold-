import express from "express";

import ReviewController from "../controllers/review.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import validate from "../middleware/validate.js";

import {
  createReviewValidator,
  updateReviewValidator,
  updateApprovalValidator,
  productReviewQueryValidator,
  adminReviewQueryValidator,
} from "../validators/review.validator.js";

const router = express.Router();

/*
===========================================================
Customer Routes (FIRST)
===========================================================
*/

router.get(
  "/my",
  authMiddleware,
  roleMiddleware("Customer"),
  ReviewController.getMyReviews
);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("Customer"),
  validate(createReviewValidator),
  ReviewController.createReview
);

router.put(
  "/:reviewId",
  authMiddleware,
  roleMiddleware("Customer"),
  validate(updateReviewValidator),
  ReviewController.updateReview
);

router.delete(
  "/:reviewId",
  authMiddleware,
  roleMiddleware("Customer"),
  ReviewController.deleteReview
);

/*
===========================================================
Admin Routes
===========================================================
*/

router.get(
  "/admin/all",
  authMiddleware,
  roleMiddleware("Admin", "SuperAdmin"),
  validate(adminReviewQueryValidator),
  ReviewController.getAllReviews
);

router.patch(
  "/admin/:reviewId/approval",
  authMiddleware,
  roleMiddleware("Admin", "SuperAdmin"),
  validate(updateApprovalValidator),
  ReviewController.updateApproval
);

router.delete(
  "/admin/:reviewId",
  authMiddleware,
  roleMiddleware("Admin", "SuperAdmin"),
  ReviewController.deleteReviewByAdmin
);

/*
===========================================================
Public Routes (LAST)
===========================================================
*/

router.get(
  "/product/:productId",
  validate(productReviewQueryValidator),
  ReviewController.getProductReviews
);

router.get(
  "/:reviewId",
  ReviewController.getReviewById
);

export default router;