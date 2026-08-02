class CartDTO {

  // =====================================
  // Add Item
  // =====================================

  static add(data) {

    const quantity =
      Number(data.quantity);

    if (
      !quantity ||
      quantity < 1
    ) {
      throw new Error(
        "Quantity must be greater than zero."
      );
    }

    return {
      quantity,
    };

  }

  // =====================================
  // Update Item
  // =====================================

  static update(data) {

    const quantity =
      Number(data.quantity);

    if (
      !quantity ||
      quantity < 1
    ) {
      throw new Error(
        "Quantity must be greater than zero."
      );
    }

    return {
      quantity,
    };

  }

}

export { CartDTO };