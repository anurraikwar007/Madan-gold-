import ReviewRepository from "../repositories/review.repository.js";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";
import ApiError from "../utils/ApiError.js";

class ReviewService {
  async createReview(customerId, payload) {
    const { product, rating, title, comment, images = [] } = payload;

    const productExists = await Product.findById(product);

    if (!productExists) {
      throw new ApiError(404, "Product not found");
    }

    const alreadyReviewed =
      await ReviewRepository.findByCustomerAndProduct(customerId, product);

    if (alreadyReviewed) {
      throw new ApiError(
        409,
        "You have already reviewed this product"
      );
    }

    const purchased = await Order.exists({
      customer: customerId,
      orderStatus: "Delivered",
      "items.product": product,
    });

    const review = await ReviewRepository.createReview({
      customer: customerId,
      product,
      rating,
      title,
      comment,
      images,
      isVerifiedPurchase: !!purchased,
    });

    await this.updateProductRating(product);

    return review;
  }

  async getProductReviews(productId, query) {
    return await ReviewRepository.getProductReviews(
      productId,
      query
    );
  }

  async getReviewById(reviewId) {
    const review = await ReviewRepository.findById(reviewId);

    if (!review) {
      throw new ApiError(404, "Review not found");
    }

    return review;
  }

  async updateReview(customerId, reviewId, payload) {
    const review = await ReviewRepository.findById(reviewId);

    if (!review) {
      throw new ApiError(404, "Review not found");
    }

    if (review.customer._id.toString() !== customerId.toString()) {
      throw new ApiError(
        403,
        "You are not allowed to update this review"
      );
    }

    const updatedReview =
      await ReviewRepository.updateReview(reviewId, payload);

    await this.updateProductRating(review.product._id);

    return updatedReview;
  }

  async deleteReview(customerId, reviewId, isAdmin = false) {
    const review = await ReviewRepository.findById(reviewId);

    if (!review) {
      throw new ApiError(404, "Review not found");
    }

    if (
      !isAdmin &&
      review.customer._id.toString() !== customerId.toString()
    ) {
      throw new ApiError(
        403,
        "You are not allowed to delete this review"
      );
    }

    await ReviewRepository.deleteReview(reviewId);

    await this.updateProductRating(review.product._id);

    return null;
  }

  async getAllReviews(query) {
    return await ReviewRepository.getAllReviews(query);
  }
     
    async getMyReviews(customerId) {
  return await ReviewRepository.getCustomerReviews(customerId);
  }   
     
      async updateApproval(reviewId, isApproved) {
  const review = await ReviewRepository.findById(reviewId);

  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  const updatedReview =
    await ReviewRepository.updateApproval(
      reviewId,
      isApproved
    );

  await this.updateProductRating(review.product._id);

  return updatedReview;
}

  async updateProductRating(productId) {
    const stats =
      await ReviewRepository.getAverageRating(productId);

    await Product.findByIdAndUpdate(productId, {
      averageRating: stats.averageRating,
      totalReviews: stats.totalReviews,
    });
  }
}

export default new ReviewService();