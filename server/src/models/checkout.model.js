import mongoose from "mongoose";

const checkoutItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    makingCharge: {
      type: Number,
      default: 0,
    },

    gst: {
      type: Number,
      default: 0,
    },

    subtotal: {
      type: Number,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const checkoutSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      unique: true,
    },

    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
      required: true,
    },

    items: [checkoutItemSchema],

    shippingAddress: {
      fullName: String,
      phone: String,
      house: String,
      area: String,
      landmark: String,
      city: String,
      state: String,
      country: String,
      pincode: String,
    },

    subtotal: {
      type: Number,
      default: 0,
    },

    makingCharge: {
      type: Number,
      default: 0,
    },

    gst: {
      type: Number,
      default: 0,
    },

    shippingCharge: {
      type: Number,
      default: 0,
    },

    discount: {
      type: Number,
      default: 0,
    },

    grandTotal: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: [
        "PENDING",
        "READY",
        "COMPLETED",
        "EXPIRED",
      ],
      default: "PENDING",
    },
  },
  {
    timestamps: true,
  }
);

const Checkout = mongoose.model(
  "Checkout",
  checkoutSchema
);

export default Checkout;