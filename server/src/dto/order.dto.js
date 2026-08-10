export const createOrderDTO = (body = {}) => {
  return {
    shippingAddress: body.shippingAddress,

     paymentMethod:
     body.paymentMethod || "UPI",

     couponCode:
      body.couponCode?.trim() || null,

     shippingCharge: 0,

     gst: 0,
  };
};