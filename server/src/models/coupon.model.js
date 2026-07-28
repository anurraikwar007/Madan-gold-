import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    discountType: {
      type: String,
      enum: ["Percentage", "Flat"],
      required: true,
    },

    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },

    minimumOrderAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    maximumDiscount: {
      type: Number,
      default: 0,
      min: 0,
    },

    usageLimit: {
      type: Number,
      default: 1,
      min: 1,
    },

    usedCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    validFrom: {
      type: Date,
      required: true,
      index: true,
    },

    validTill: {
      type: Date,
      required: true,
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    // ==========================================
    // Soft Delete
    // ==========================================

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    deletedAt: {
      type: Date,
      default: null,
    },

    // ==========================================
    // Audit
    // ==========================================

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// ==========================================
// Compound Indexes
// ==========================================

couponSchema.index({
  isDeleted: 1,
  isActive: 1,
});

couponSchema.index({
  validFrom: 1,
  validTill: 1,
});

couponSchema.index({
  code: 1,
  isDeleted: 1,
});

const Coupon = mongoose.model(
  "Coupon",
  couponSchema
);

export default Coupon;