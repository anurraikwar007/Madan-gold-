import Joi from "joi";

class CheckoutValidator {

  // =====================================================
  // Create Checkout
  // =====================================================

  create() {

  return Joi.object({

    shippingAddress:
      this.shippingAddress()
        .required(),

    couponCode:
      Joi.string()
        .trim()
        .uppercase()
        .allow("")
        .optional(),

  });

}

  // =====================================================
  // Shipping Address
  // =====================================================

  shippingAddress() {

    return Joi.object({

      fullName: Joi.string()
        .trim()
        .required(),

      phone: Joi.string()
        .trim()
        .required(),

      house: Joi.string()
        .trim()
        .required(),

      area: Joi.string()
        .trim()
        .required(),

      landmark: Joi.string()
        .trim()
        .allow("")
        .optional(),

      city: Joi.string()
        .trim()
        .required(),

      state: Joi.string()
        .trim()
        .required(),

      country: Joi.string()
        .trim()
        .required(),

      pincode: Joi.string()
        .trim()
        .required(),

    });

  }

  // =====================================================
  // Apply Coupon
  // =====================================================

  applyCoupon() {

    return Joi.object({

      coupon: Joi.string()
        .trim()
        .uppercase()
        .required(),

    });

  }

  // =====================================================
  // Checkout Id
  // =====================================================

  checkoutId() {

    return Joi.object({

      id: Joi.string()
        .hex()
        .length(24)
        .required(),

    });

  }

}

export default new CheckoutValidator();