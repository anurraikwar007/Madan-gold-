import mongoose from "mongoose";

// =====================================================
// Change Schema
// =====================================================

const changeSchema = new mongoose.Schema(
  {
    field: {
      type: String,
      required: true,
      trim: true,
    },

    oldValue: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    newValue: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  {
    _id: false,
  }
);

// =====================================================
// Audit Metadata Schema
// =====================================================

const auditMetadataSchema = new mongoose.Schema(
  {
    productIds: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
      ],
      default: [],
    },

    bulk: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
    strict: true,
  }
);

// =====================================================
// Audit Log Schema
// =====================================================

const auditLogSchema = new mongoose.Schema(
  {
    entityType: {
      type: String,
      required: true,
      enum: [
        "Product",
        "Order",
        "Customer",
        "Coupon",
        "Category",
        "Wishlist",
        "Cart",
        "Checkout",
        "Payment",
        "Inventory",
        "Admin",
      ],
      index: true,
    },

    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      index: true,
    },

    action: {
      type: String,
      required: true,
      enum: [
        "CREATE",
        "UPDATE",
        "DELETE",
        "RESTORE",

        "LOGIN",
        "LOGOUT",

        "STATUS_CHANGE",

        "PAYMENT_SUBMITTED",
        "PAYMENT_VERIFIED",
        "PAYMENT_REJECTED",

        "ORDER_CREATED",
        "ORDER_CONFIRMED",
        "ORDER_CANCELLED",
        "ORDER_DELIVERED",

        "TRACKING_UPDATE",
        "CUSTOMER_CANCEL",

        "COUPON_APPLY",
        "COUPON_REMOVE",
        "COMPLETE",
        "EXPIRE",

        "STOCK_IN",
        "STOCK_OUT",
      ],
      index: true,
    },

    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "performedByModel",
      required: true,
      index: true,
    },

    performedByModel: {
      type: String,
      enum: ["Admin", "Customer"],
      required: true,
    },

    changes: {
      type: [changeSchema],
      default: [],
    },

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

    requestId: {
      type: String,
      default: "",
      index: true,
    },

    metadata: {
      type: auditMetadataSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  }
);

// =====================================================
// Indexes
// =====================================================

auditLogSchema.index({
  entityType: 1,
  entityId: 1,
  createdAt: -1,
});

auditLogSchema.index({
  performedBy: 1,
  createdAt: -1,
});

auditLogSchema.index({
  action: 1,
  createdAt: -1,
});

const AuditLog =
  mongoose.models.AuditLog ||
  mongoose.model("AuditLog", auditLogSchema);

export default AuditLog;