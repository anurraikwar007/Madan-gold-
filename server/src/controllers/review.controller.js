import ReviewService from "../services/review.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";

class ReviewController {
  // POST /api/reviews
  createReview = asyncHandler(async (req, res) => {
    const review = await ReviewService.createReview(
      req.user._id,
      req.body
    );

    return res
      .status(201)
      .json(
        apiResponse.success(
          "Review submitted successfully",
          review
        )
      );
  });

  // GET /api/reviews/product/:productId
  getProductReviews = asyncHandler(async (req, res) => {
    const reviews = await ReviewService.getProductReviews(
      req.params.productId,
      req.query
    );

    return res
      .status(200)
      .json(
        apiResponse.success(
          "Product reviews fetched successfully",
          reviews 
        )
      );
  });

  // GET /api/reviews/:reviewId
  getReviewById = asyncHandler(async (req, res) => {
    const review = await ReviewService.getReviewById(
      req.params.reviewId
    );

    return res
      .status(200)
      .json(
         apiResponse.success(
          "Review fetched successfully",
          review
        )
      );
  });
    
    getMyReviews = asyncHandler(async (req, res) => {
  const reviews = await ReviewService.getMyReviews(req.user._id);

  return res.status(200).json(
    apiResponse.success(
      "My reviews fetched successfully",
      reviews
    )
  );
});

  // PATCH /api/reviews/:reviewId
  updateReview = asyncHandler(async (req, res) => {
    const review = await ReviewService.updateReview(
      req.user._id,
      req.params.reviewId,
      req.body
    );

    return res
      .status(200)
      .json(
        apiResponse.success(
          "Review updated successfully",
          review
        )
      );
  });

  // DELETE /api/reviews/:reviewId
  deleteReview = asyncHandler(async (req, res) => {
    await ReviewService.deleteReview(
      req.user._id,
      req.params.reviewId
    );

    return res
      .status(200)
      .json(
        apiResponse.success(
          "Review deleted successfully"
        )
      );
  });

  // ==========================
  // Admin
  // ==========================

  // GET /api/reviews/admin/all
  getAllReviews = asyncHandler(async (req, res) => {
    const reviews = await ReviewService.getAllReviews(
      req.query
    );

    return res
      .status(200)
      .json(
        apiResponse.success(
          "Reviews fetched successfully",
          reviews
        )
      );
  });

  // DELETE /api/reviews/admin/:reviewId
  deleteReviewByAdmin = asyncHandler(async (req, res) => {
    await ReviewService.deleteReview(
      req.user._id,
      req.params.reviewId,
      true
    );

    return res
      .status(200)
      .json(
        apiResponse.success(
          "Review deleted successfully"
        )
      );
  });
   
   // PATCH /api/reviews/admin/:reviewId/approval
   updateApproval = asyncHandler(async (req, res) => {
  const { isApproved } = req.body;

  const review =
    await ReviewService.updateApproval(
      req.params.reviewId,
      isApproved
    );

  return res
    .status(200)
    .json(
      apiResponse.success(
        "Review approval updated successfully",
        review
      )
    );
   });

}

export default new ReviewController();