import Counter from "../models/counter.model.js";

export const generateOrderNumber = async () => {
  const now = new Date();

  const date =
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0");

  const counter = await Counter.findOneAndUpdate(
    {
      name: "ORDER",
      date,
    },
    {
      $inc: {
        sequence: 1,
      },
    },
    {
      new: true,
      upsert: true,
    }
  );

  const serial = String(counter.sequence).padStart(6, "0");

  return `MG-${date}-${serial}`;
};