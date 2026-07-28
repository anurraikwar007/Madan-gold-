import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    title: {
      type: String,
      trim: true,
      default: "",
    },

    comment: {
      type: String,
      required: true,
      trim: true,
    },

    images: [
      {
        public_id: String,
        url: String,
      },
    ],

    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    },

    isApproved: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// One Review Per Customer Per Product
reviewSchema.index(
  {
    customer: 1,
    product: 1,
  },
  {
    unique: true,
  }
);

const Review = mongoose.model("Review", reviewSchema);

export default Review;