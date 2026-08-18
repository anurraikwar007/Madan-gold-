import {
  useEffect,
  useState,
} from "react";

import {
  Star,
} from "lucide-react";

import {
  getProductReviews,
} from "../../api/review.api";

export default function ProductReviews({
  productId,
  averageRating = 0,
  totalReviews = 0,
}) {
  const [reviews, setReviews] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const response =
          await getProductReviews(
            productId
          );

        const data =
          response?.data?.data;

        const list =
          data?.reviews ||
          data?.docs ||
          (Array.isArray(data)
            ? data
            : []);

        if (mounted) {
          setReviews(list);
        }
      } catch {
        if (mounted) {
          setReviews([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [productId]);

  return (
    <section className="mt-20">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#B88A44]">
            Customer Love
          </p>

          <h2 className="mt-2 text-3xl sm:text-4xl">
            Reviews
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-[#B88A44]">
            <Star
              size={20}
              fill="currentColor"
            />

            <span className="font-bold">
              {Number(
                averageRating
              ).toFixed(1)}
            </span>
          </div>

          <span className="text-sm text-gray-500">
            {totalReviews} reviews
          </span>
        </div>
      </div>

      {loading ? (
        <div className="mt-8 rounded-3xl bg-white p-8 text-center text-gray-400">
          Loading reviews...
        </div>
      ) : reviews.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-[#ead9bd] bg-white p-10 text-center">
          <p className="text-gray-500">
            No reviews yet.
          </p>

          <p className="mt-2 text-sm text-gray-400">
            Be the first to share your experience.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {reviews.map((review) => (
            <article
              key={review._id}
              className="
                rounded-3xl
                border
                border-[#eee4d5]
                bg-white
                p-6
                shadow-[0_15px_45px_rgba(40,25,20,.06)]
              "
            >
              <div className="flex items-center justify-between">
                <div className="flex gap-1 text-[#B88A44]">
                  {Array.from({
                    length: 5,
                  }).map((_, index) => (
                    <Star
                      key={index}
                      size={16}
                      fill={
                        index <
                        Number(
                          review.rating || 0
                        )
                          ? "currentColor"
                          : "none"
                      }
                    />
                  ))}
                </div>

                {review.isVerifiedPurchase && (
                  <span className="text-xs font-semibold text-emerald-700">
                    Verified Purchase
                  </span>
                )}
              </div>

              {review.title && (
                <h3 className="mt-4 text-lg">
                  {review.title}
                </h3>
              )}

              <p className="mt-3 text-sm leading-7 text-gray-600">
                {review.comment}
              </p>

              <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-gray-400">
                {review.customer?.name ||
                  "Customer"}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}