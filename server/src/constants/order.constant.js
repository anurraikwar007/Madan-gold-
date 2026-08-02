export const ORDER_STATUS = {
  Pending: ["Confirmed", "Cancelled"],

  Confirmed: ["Processing", "Cancelled"],

  Processing: ["Packed", "Cancelled"],

  Packed: ["Shipped"],

  Shipped: ["Out For Delivery"],

  "Out For Delivery": ["Delivered"],

  Delivered: [],

  Cancelled: [],

  Returned: [],
};

export const PAYMENT_STATUS = [
  "Pending",
  "Verification Pending",
  "Paid",
  "Rejected",
  "Refunded",
];