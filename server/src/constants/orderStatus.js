const ORDER_STATUS = Object.freeze({
  Pending: [
    "Confirmed",
    "Cancelled",
  ],

  Confirmed: [
    "Processing",
    "Cancelled",
  ],

  Processing: [
    "Packed",
    "Cancelled",
  ],

  Packed: [
    "Shipped",
    "Cancelled",
  ],

  Shipped: [
    "Out For Delivery",
  ],

  "Out For Delivery": [
    "Delivered",
  ],

  Delivered: [],

  Cancelled: [],

  Returned: [],
});

export default ORDER_STATUS;