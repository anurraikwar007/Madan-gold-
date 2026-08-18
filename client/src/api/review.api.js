import api from "../lib/axios";

export const getProductReviews = (
  productId,
  params = {}
) =>
  api.get(
    `/reviews/product/${productId}`,
    { params }
  );

export const createReview = (data) =>
  api.post("/reviews", data);

export const updateReview = (
  reviewId,
  data
) =>
  api.put(
    `/reviews/${reviewId}`,
    data
  );

export const deleteReview = (
  reviewId
) =>
  api.delete(
    `/reviews/${reviewId}`
  );