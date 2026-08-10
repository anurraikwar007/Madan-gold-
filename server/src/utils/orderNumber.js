import Counter from "../models/counter.model.js";

export const generateOrderNumber = async (
  session = null
) => {
  const now = new Date();

  const date =
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0");

  const options = {
    new: true,
    upsert: true,
  };

  if (session) {
    options.session = session;
  }

  const counter =
    await Counter.findOneAndUpdate(
      {
        name: "ORDER",
        date,
      },
      {
        $inc: {
          sequence: 1,
        },
      },
      options
    );

  if (!counter) {
    throw new Error(
      "Unable to generate order number."
    );
  }

  const serial =
    String(counter.sequence).padStart(6, "0");

  return `MG-${date}-${serial}`;
};