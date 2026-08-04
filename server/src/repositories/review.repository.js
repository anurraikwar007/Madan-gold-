import Review from "../models/review.model.js";

class ReviewRepository {
  async createReview(data) {
    return await Review.create(data);
  }

  async findById(reviewId) {
    return await Review.findById(reviewId)
      .populate("customer", "name avatar")
      .populate("product", "name slug images averageRating");
  }

  async findByCustomerAndProduct(customerId, productId) {
    return await Review.findOne({
      customer: customerId,
      product: productId,
    });
  }

  async getProductReviews(
    productId,
    {
      page = 1,
      limit = 10,
      sort = "-createdAt",
      rating,
      approved = true,
    } = {}
  ) {
    const filter = {
      product: productId,
    };

    if (approved !== undefined) {
      filter.isApproved = approved;
    }

    if (rating) {
      filter.rating = Number(rating);
    }

    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      Review.find(filter)
        .populate("customer", "name avatar")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),

      Review.countDocuments(filter),
    ]);

    return {
      reviews,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateReview(reviewId, data) {
    return await Review.findByIdAndUpdate(reviewId, data, {
      new: true,
      runValidators: true,
    });
  }

  async deleteReview(reviewId) {
    return await Review.findByIdAndDelete(reviewId);
  }

  async getAverageRating(productId) {
    const result = await Review.aggregate([
      {
        $match: {
          product: productId,
          isApproved: true,
        },
      },
      {
        $group: {
          _id: "$product",
          averageRating: {
            $avg: "$rating",
          },
          totalReviews: {
            $sum: 1,
          },
        },
      },
    ]);

    if (!result.length) {
      return {
        averageRating: 0,
        totalReviews: 0,
      };
    }

    return {
      averageRating: Number(result[0].averageRating.toFixed(1)),
      totalReviews: result[0].totalReviews,
    };
  }

  async getAllReviews({
    page = 1,
    limit = 10,
    approved,
    search,
  } = {}) {
    const filter = {};

    if (approved !== undefined) {
      filter.isApproved = approved;
    }

    if (search) {
      filter.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          comment: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      Review.find(filter)
        .populate("customer", "name email")
        .populate("product", "name")
        .sort("-createdAt")
        .skip(skip)
        .limit(limit),

      Review.countDocuments(filter),
    ]);

    return {
      reviews,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
    
  async getCustomerReviews(customerId) {
  return await Review.find({
    customer: customerId,
  })
    .populate("product", "name slug images averageRating")
    .sort("-createdAt");
  }

    async updateApproval(reviewId, isApproved) {
  return await Review.findByIdAndUpdate(
    reviewId,
    {
      isApproved,
    },
    {
      new: true,
      runValidators: true,
    }
  );
}

}

export default new ReviewRepository();