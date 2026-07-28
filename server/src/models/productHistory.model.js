import mongoose from "mongoose";

const changeSchema = new mongoose.Schema(
  {
    field: {
      type: String,
      required: true,
    },

    oldValue: {
      type: mongoose.Schema.Types.Mixed,
    },

    newValue: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    _id: false,
  }
);

const productHistorySchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    action: {
      type: String,
      enum: [
        "CREATE",
        "UPDATE",
        "DELETE",
        "RESTORE",
      ],
      required: true,
      index: true,
    },

    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
      index: true,
    },

    changes: [changeSchema],

    reason: {
      type: String,
      default: "",
      trim: true,
    },

    ipAddress: {
      type: String,
      default: "",
    },

    userAgent: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

productHistorySchema.index({
  product: 1,
  createdAt: -1,
});

productHistorySchema.index({
  changedBy: 1,
  createdAt: -1,
});

const ProductHistory =
  mongoose.models.ProductHistory ||
  mongoose.model(
    "ProductHistory",
    productHistorySchema
  );

export default ProductHistory;