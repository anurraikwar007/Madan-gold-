import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      default: "",
      trim: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    metal: {
      type: String,
      default: "",
      trim: true,
    },

    purity: {
      type: String,
      default: "",
      trim: true,
    },

    weight: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    _id: false,
  }
);

const shippingAddressSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    house: {
      type: String,
      required: true,
      trim: true,
    },

    area: {
      type: String,
      required: true,
      trim: true,
    },

    landmark: {
      type: String,
      default: "",
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      required: true,
      trim: true,
    },

    country: {
      type: String,
      default: "India",
      trim: true,
    },

    pincode: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
  }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      index: true,
    },

    idempotencyKey: {
      type: String,
      trim: true,
      default: null,
      maxlength: 100,
    },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      
    },

    items: {
      type: [orderItemSchema],
      required: true,
    },

    shippingAddress: {
      type: shippingAddressSchema,
      required: true,
    },

    paymentMethod: {
        type: String,
        enum: ["COD", "PHONEPE", "UPI"],
        default: "PHONEPE",
      },

    paymentStatus: {
      type: String,
      enum: [
        "Pending",
        "Verification Pending",
        "Paid",
        "Rejected",
        "Refunded",
      ],
      default: "Pending",
      
    },

    phonePeMerchantOrderId: {
        type: String,
        trim: true,
        unique: true,
        sparse: true,
      },

        phonePeOrderId: {
          type: String,
          default: "",
          trim: true,
        },

        phonePeTransactionId: {
          type: String,
          default: "",
          trim: true,
        },

        phonePeState: {
          type: String,
          default: "",
          trim: true,
        },

        paymentRedirectUrl: {
          type: String,
          default: "",
          trim: true,
        },

    paymentApp: {
      type: String,
      enum: [
        "Google Pay",
        "PhonePe",
        "Paytm",
        "BHIM",
        "Other",
      ],
      default: "Other",
    },

    transactionId: {
      type: String,
      default: "",
      trim: true,
      index: true,
    },

    paymentScreenshot: {
      type: String,
      default: "",
    },

    paymentSubmittedAt: {
      type: Date,
      default: null,
    },

    paymentVerifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    default: null,
   },

    paymentVerifiedAt: {
    type: Date,
    default: null,
    },

    paymentRemark: {
    type: String,
    default: "",
    trim: true,
     },

    orderStatus: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Processing",
        "Packed",
        "Shipped",
        "Out For Delivery",
        "Delivered",
        "Cancelled",
        "Returned",
      ],
      default: "Pending",
      
    },

    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
      default: null,
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    
    makingCharge: {
      type: Number,
      default: 0,
      min: 0,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
    },

    shippingCharge: {
      type: Number,
      default: 0,
      min: 0,
    },

    gst: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
      
    // =====================================
// Invoice
// =====================================

invoiceNumber: {
  type: String,
  default: "",
  trim: true,
  index: true,
},

invoiceGenerated: {
  type: Boolean,
  default: false,
},

invoiceGeneratedAt: {
  type: Date,
  default: null,
},

invoiceUrl: {
  type: String,
  default: "",
  trim: true,
},


    trackingNumber: {
      type: String,
      default: "",
      trim: true,
    },

    courierPartner: {
      type: String,
      default: "",
      trim: true,
    },

    estimatedDeliveryDate: {
      type: Date,
      default: null,
    },

    deliveredAt: {
      type: Date,
      default: null,
    },

    cancelledAt: {
      type: Date,
      default: null,
    },

    cancelReason: {
      type: String,
      default: "",
      trim: true,
    },

    customerNote: {
      type: String,
      default: "",
      trim: true,
    },

    adminNote: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.pre(
  "validate",
  function () {
    if (!this.orderNumber) {
      this.orderNumber =
        "MG-" +
        Date.now().toString(36).toUpperCase() +
        "-" +
        Math.random()
          .toString(36)
          .slice(2, 8)
          .toUpperCase();
    }
  }
);

  orderSchema.index({
    customer: 1,
    createdAt: -1,
    _id: -1,
  });

  orderSchema.index({
    orderStatus: 1,
    createdAt: -1,
  });

  orderSchema.index({
    paymentStatus: 1,
    createdAt: -1,
  });

  orderSchema.index({
    paymentMethod: 1,
    createdAt: -1,
  });
  
  orderSchema.index(
  {
    customer: 1,
    idempotencyKey: 1,
  },
  {
    unique: true,
    sparse: true,
    name: "customer_order_idempotency",
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;