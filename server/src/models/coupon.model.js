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

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    deletedAt: {
      type: Date,
      default: null,
    },

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

// ======================================================
// Validation
// ======================================================

couponSchema.pre("validate", function () {

  if (this.validTill <= this.validFrom) {
    throw new Error(
      "validTill must be greater than validFrom."
    );
  }

  if (
    this.discountType === "Percentage" &&
    this.discountValue > 100
  ) {
    throw new Error(
      "Percentage discount cannot exceed 100."
    );
  }

});

// ======================================================
// Hide Deleted Coupons
// ======================================================

couponSchema.pre(/^find/, function () {

  this.where({
    isDeleted: false,
  });

  

});

// ======================================================
// Instance Method
// ======================================================

couponSchema.methods.isValidCoupon =
function () {

  const now = new Date();

  return (

    this.isActive &&

    !this.isDeleted &&

    this.usedCount < this.usageLimit &&

    now >= this.validFrom &&

    now <= this.validTill

  );

};

// ======================================================
// Compound Indexes
// ======================================================

couponSchema.index(
  {
    isDeleted: 1,
    isActive: 1,
  }
);

couponSchema.index(
  {
    validFrom: 1,
    validTill: 1,
  }
);

couponSchema.index(
  {
    code: 1,
    isDeleted: 1,
  }
);
// ======================================================
// Static Methods
// ======================================================

couponSchema.statics.getActiveCoupons =
function () {

  const now = new Date();

  return this.find({

    isDeleted: false,

    isActive: true,

    validFrom: {
      $lte: now,
    },

    validTill: {
      $gte: now,
    },

    $expr: {
      $lt: [
        "$usedCount",
        "$usageLimit",
      ],
    },

  });

};

couponSchema.statics.getExpiredCoupons =
function () {

  return this.find({

    isDeleted: false,

    validTill: {
      $lt: new Date(),
    },

  });

};

// ======================================================
// Export
// ======================================================

const Coupon =
  mongoose.models.Coupon ||
  mongoose.model(
    "Coupon",
    couponSchema
  );

export default Coupon;