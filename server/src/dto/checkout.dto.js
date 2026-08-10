class CheckoutDTO {

  // =====================================
  // Create Checkout
  // =====================================

  static create(data = {}) {

  return {
    shippingAddress:
      data.shippingAddress
        ? this.address(
            data.shippingAddress
          )
        : null,

    couponCode:
      data.couponCode
        ?.trim()
        .toUpperCase() || null,
  };
 }

  // =====================================
  // Shipping Address
  // =====================================

  static address(data) {

    const {

      fullName,

      phone,

      house,

      area,

      city,

      state,

      country,

      pincode,

      landmark = "",

    } = data;

    if (!fullName)
      throw new Error("Full name is required.");

    if (!phone)
      throw new Error("Phone is required.");

    if (!house)
      throw new Error("House/Flat is required.");

    if (!area)
      throw new Error("Area is required.");

    if (!city)
      throw new Error("City is required.");

    if (!state)
      throw new Error("State is required.");

    if (!country)
      throw new Error("Country is required.");

    if (!pincode)
      throw new Error("Pincode is required.");

    return {

      fullName,

      phone,

      house,

      area,

      landmark,

      city,

      state,

      country,

      pincode,

    };

  }

}

export { CheckoutDTO };