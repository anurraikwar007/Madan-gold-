import mongoose from "mongoose";

const counterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    date: {
      type: String,
      required: true,
    },

    sequence: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

counterSchema.index(
  { name: 1, date: 1 },
  { unique: true }
);

const Counter = mongoose.model("Counter", counterSchema);

export default Counter;