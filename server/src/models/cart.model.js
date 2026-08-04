import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },

    price: {
      type: Number,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const cartSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      unique: true,
    },

    items: [cartItemSchema],

    totalItems: {
      type: Number,
      default: 0,
    },

    totalAmount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Auto Calculate Totals
cartSchema.pre("save", function () {
  this.totalItems = this.items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  this.totalAmount = this.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;