import ApiError from "../utils/apiError.js";

export const createOrderDTO = (body = {}) => {
  const paymentMethod =
    String(
      body.paymentMethod || "PHONEPE"
    )
      .trim()
      .toUpperCase();

  if (
    !["COD", "PHONEPE", "UPI"].includes(
      paymentMethod
    )
  ) {
    throw new ApiError(
      400,
      "Invalid payment method."
    );
  }

  return {
    shippingAddress:
      body.shippingAddress,

    paymentMethod,

    couponCode:
      body.couponCode
        ?.trim()
        .toUpperCase() || null,

    shippingCharge: 0,

    gst: 0,
  };
};