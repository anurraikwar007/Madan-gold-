class CheckoutDTO {

  // =====================================
  // Create Checkout
  // =====================================

  static create(data) {

    if (
      !data.customer
    ) {
      throw new Error(
        "Customer is required."
      );
    }

    if (
      !data.cart
    ) {
      throw new Error(
        "Cart is required."
      );
    }

    return {
      customer: data.customer,
      cart: data.cart,
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