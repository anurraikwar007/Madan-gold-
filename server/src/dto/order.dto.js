export const createOrderDTO = (body = {}) => {
  return {
    shippingAddress: body.shippingAddress,

    paymentMethod:
      body.paymentMethod || "ONLINE",

    couponCode:
      body.couponCode?.trim() || null,

    shippingCharge:
      Number(body.shippingCharge || 0),

    gst:
      Number(body.gst || 0),
  };
};