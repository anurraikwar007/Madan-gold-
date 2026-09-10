const roundMoney = (value) =>
  Math.round(
    (Number(value) || 0) * 100
  ) / 100;

// =====================================================
// Product Selling Price
// =====================================================

export const getSellingPrice = (
  product
) => {
  const basePrice =
    Number(product?.price) || 0;

  const discountPrice =
    Number(product?.discountPrice) || 0;

  if (
    discountPrice > 0 &&
    discountPrice < basePrice
  ) {
    return roundMoney(
      discountPrice
    );
  }

  return roundMoney(basePrice);
};

// =====================================================
// Item Pricing
// =====================================================

export const calculateItemPricing = (
  product,
  quantity = 1
) => {
  const safeQuantity = Math.max(
    Number(quantity) || 1,
    1
  );

  const sellingPrice =
    getSellingPrice(product);

  const makingCharge =
    Math.max(
      Number(
        product?.makingCharges
      ) || 0,
      0
    ) * safeQuantity;

  const subtotal =
    sellingPrice *
    safeQuantity;

  const gstRate = Math.min(
    Math.max(
      Number(product?.gst) || 0,
      0
    ),
    100
  );

  const gst =
    (subtotal + makingCharge) *
    (gstRate / 100);

  return {
    quantity: safeQuantity,

    sellingPrice:
      roundMoney(sellingPrice),

    subtotal:
      roundMoney(subtotal),

    makingCharge:
      roundMoney(makingCharge),

    gst:
      roundMoney(gst),

    total:
      roundMoney(
        subtotal +
          makingCharge +
          gst
      ),
  };
};

// =====================================================
// Cart Pricing
// =====================================================

export const calculateCartPricing = (
  items = []
) => {
  let subtotal = 0;
  let makingCharge = 0;
  let gst = 0;

  for (const item of items) {
    const product =
      item.product || item;

    const pricing =
      calculateItemPricing(
        product,
        item.quantity
      );

    subtotal +=
      pricing.subtotal;

    makingCharge +=
      pricing.makingCharge;

    gst += pricing.gst;
  }

  return {
    subtotal:
      roundMoney(subtotal),

    makingCharge:
      roundMoney(makingCharge),

    gst:
      roundMoney(gst),
  };
};

// =====================================================
// Shipping
// =====================================================

export const calculateShipping = (
  subtotal
) => {
  const safeSubtotal =
    Math.max(
      Number(subtotal) || 0,
      0
    );

  return safeSubtotal >= 1000
    ? 0
    : 100;
};

// =====================================================
// Grand Total
// =====================================================

export const calculateGrandTotal = ({
  subtotal = 0,
  makingCharge = 0,
  gst = 0,
  shippingCharge = 0,
  discount = 0,
}) => {
  return roundMoney(
    Math.max(
      0,
      Number(subtotal) +
        Number(makingCharge) +
        Number(gst) +
        Number(shippingCharge) -
        Number(discount)
    )
  );
};