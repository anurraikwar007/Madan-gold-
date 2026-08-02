import mongoose from "mongoose";

import CheckoutRepository from "../repositories/checkout.repository.js";
import CartRepository from "../repositories/cart.repository.js";
import ProductRepository from "../repositories/product.repository.js";

import AuditService from "./audit.service.js";

import { CheckoutDTO } from "../dto/checkout.dto.js";

class CheckoutService {

  // =====================================================
  // Create Checkout
  // =====================================================

  async createCheckout(
    customerId,
    payload,
    context
  ) {

    const session =
      await mongoose.startSession();

    session.startTransaction();

    try {

      const dto =
        CheckoutDTO.create(payload);

      // ==========================================
      // Customer Cart
      // ==========================================

      const cart =
        await CartRepository.findOne(
          {
            customer: customerId,
          },
          {
            populate: [
              {
                path: "items.product",
              },
            ],
            lean: false,
            session,
          }
        );

      if (
        !cart ||
        cart.items.length === 0
      ) {

        throw new Error(
          "Cart is empty."
        );

      }

      // ==========================================
      // Existing Checkout
      // ==========================================

      const existingCheckout =
        await CheckoutRepository.findOne(
          {
            customer: customerId,
            status: "PENDING",
          },
          {
            lean: false,
            session,
          }
        );

      if (existingCheckout) {

        await CheckoutRepository.deleteOne(
          {
            _id: existingCheckout._id,
          },
          {
            session,
          }
        );

      }

      // ==========================================
      // Prepare Items
      // ==========================================

      const checkoutItems = [];

      let subtotal = 0;

      let makingCharge = 0;

      let gst = 0;

      // ==========================================
      // Validate Inventory
      // ==========================================

      for (const cartItem of cart.items) {

        const product =
          await ProductRepository.findById(
            cartItem.product._id,
            {
              lean: false,
              session,
            }
          );

        if (!product) {

          throw new Error(
            `${cartItem.product.name} not found.`
          );

        }

        if (
          product.inventory.availableStock <
          cartItem.quantity
        ) {

          throw new Error(
            `${product.name} is out of stock.`
          );

        }

        const itemSubtotal =
          cartItem.quantity *
          product.price;

        const itemMaking =
          product.makingCharge || 0;

        const itemGST =
          product.gst || 0;

        checkoutItems.push({

          product: product._id,

          name: product.name,

          quantity: cartItem.quantity,

          price: product.price,

          makingCharge: itemMaking,

          gst: itemGST,

          subtotal: itemSubtotal,

        });

        subtotal += itemSubtotal;

        makingCharge += itemMaking;

        gst += itemGST;

      }

            // ==========================================
      // Shipping Charge
      // ==========================================

      let shippingCharge = 0;

      if (subtotal < 1000) {

        shippingCharge = 100;

      }

      // ==========================================
      // Discount
      // ==========================================

      let discount = 0;

      // Coupon Logic Phase-7 me add hoga

      // ==========================================
      // Grand Total
      // ==========================================

      const grandTotal =

        subtotal +

        makingCharge +

        gst +

        shippingCharge -

        discount;

      // ==========================================
      // Create Checkout
      // ==========================================

      const checkout =
        await CheckoutRepository.create(

          {

            customer: customerId,

            cart: cart._id,

            items: checkoutItems,

            shippingAddress:
              dto.shippingAddress,

            subtotal,

            makingCharge,

            gst,

            shippingCharge,

            discount,

            grandTotal,

            status: "PENDING",

          },

          {

            session,

          }

        );

      // ==========================================
      // Audit Log
      // ==========================================

      await AuditService.log({

        entityType: "Checkout",

        entityId: checkout._id,

        action: "CREATE",

        performedBy: customerId,

        changes: [

          {

            field: "CREATE",

            oldValue: null,

            newValue: checkout,

          },

        ],

        ipAddress:
          context.ipAddress,

        userAgent:
          context.userAgent,

        requestId:
          context.requestId,

      });

      // ==========================================
      // Commit Transaction
      // ==========================================

      await session.commitTransaction();

      return checkout.toObject();

    }

    catch (error) {

      await session.abortTransaction();

      throw error;

    }

    finally {

      session.endSession();

    }

  }
    // =====================================================
  // Get Customer Checkout
  // =====================================================

  async getCheckout(customerId) {

    const checkout =
      await CheckoutRepository.findOne(

        {
          customer: customerId,
          status: "PENDING",
        },

        {
          populate: [

            {
              path: "items.product",
            },

            {
              path: "cart",
            },

          ],

          lean: true,

        }

      );

    if (!checkout) {

      throw new Error(
        "Checkout not found."
      );

    }

    return checkout;

  }

  // =====================================================
  // Get Checkout By Id
  // =====================================================

  async getCheckoutById(
    checkoutId
  ) {

    const checkout =
      await CheckoutRepository.findById(

        checkoutId,

        {

          populate: [

            {
              path: "items.product",
            },

            {
              path: "customer",
            },

            {
              path: "cart",
            },

          ],

          lean: true,

        }

      );

    if (!checkout) {

      throw new Error(
        "Checkout not found."
      );

    }

    return checkout;

  }

  // =====================================================
  // Update Shipping Address
  // =====================================================

  async updateShippingAddress(

    customerId,

    checkoutId,

    shippingAddress,

    context

  ) {

    const checkout =
      await CheckoutRepository.findOne(

        {

          _id: checkoutId,

          customer: customerId,

          status: "PENDING",

        },

        {

          lean: false,

        }

      );

    if (!checkout) {

      throw new Error(
        "Checkout not found."
      );

    }

    const oldAddress = {
      ...checkout.shippingAddress,
    };

    checkout.shippingAddress =
      shippingAddress;

    await checkout.save();

    await AuditService.log({

      entityType: "Checkout",

      entityId: checkout._id,

      action: "UPDATE",

      performedBy: customerId,

      changes: [

        {

          field: "shippingAddress",

          oldValue: oldAddress,

          newValue:
            checkout.shippingAddress,

        },

      ],

      ipAddress:
        context.ipAddress,

      userAgent:
        context.userAgent,

      requestId:
        context.requestId,

    });

    return checkout.toObject();

  }
    // =====================================================
  // Apply Coupon
  // =====================================================

  async applyCoupon(

    customerId,

    checkoutId,

    coupon,

    context

  ) {

    const checkout =
      await CheckoutRepository.findOne(

        {

          _id: checkoutId,

          customer: customerId,

          status: "PENDING",

        },

        {

          lean: false,

        }

      );

    if (!checkout) {

      throw new Error(
        "Checkout not found."
      );

    }

    /*
    =====================================================
    Coupon Module
    =====================================================

    Phase-7 me yaha CouponRepository
    integrate hoga.

    Example:

    const coupon =
      await CouponRepository.validate(...)

    checkout.discount = coupon.discount;
    */

    checkout.discount = 0;

    checkout.grandTotal =

      checkout.subtotal +

      checkout.makingCharge +

      checkout.gst +

      checkout.shippingCharge -

      checkout.discount;

    await checkout.save();

    await AuditService.log({

      entityType: "Checkout",

      entityId: checkout._id,

      action: "COUPON_APPLY",

      performedBy: customerId,

      changes: [

        {

          field: "coupon",

          oldValue: null,

          newValue: coupon,

        },

      ],

      ipAddress:
        context.ipAddress,

      userAgent:
        context.userAgent,

      requestId:
        context.requestId,

    });

    return checkout.toObject();

  }

  // =====================================================
  // Remove Coupon
  // =====================================================

  async removeCoupon(

    customerId,

    checkoutId,

    context

  ) {

    const checkout =
      await CheckoutRepository.findOne(

        {

          _id: checkoutId,

          customer: customerId,

          status: "PENDING",

        },

        {

          lean: false,

        }

      );

    if (!checkout) {

      throw new Error(
        "Checkout not found."
      );

    }

    checkout.discount = 0;

    checkout.grandTotal =

      checkout.subtotal +

      checkout.makingCharge +

      checkout.gst +

      checkout.shippingCharge;

    await checkout.save();

    await AuditService.log({

      entityType: "Checkout",

      entityId: checkout._id,

      action: "COUPON_REMOVE",

      performedBy: customerId,

      changes: [],

      ipAddress:
        context.ipAddress,

      userAgent:
        context.userAgent,

      requestId:
        context.requestId,

    });

    return checkout.toObject();

  }

  // =====================================================
  // Recalculate Checkout
  // =====================================================

  async recalculateCheckout(

    checkoutId

  ) {

    const checkout =
      await CheckoutRepository.findById(

        checkoutId,

        {

          lean: false,

        }

      );

    if (!checkout) {

      throw new Error(
        "Checkout not found."
      );

    }

    checkout.grandTotal =

      checkout.subtotal +

      checkout.makingCharge +

      checkout.gst +

      checkout.shippingCharge -

      checkout.discount;

    await checkout.save();

    return checkout.toObject();

  }
    // =====================================================
  // Complete Checkout
  // =====================================================

  async completeCheckout(

    checkoutId,

    context

  ) {

    const checkout =
      await CheckoutRepository.findById(

        checkoutId,

        {

          lean: false,

        }

      );

    if (!checkout) {

      throw new Error(
        "Checkout not found."
      );

    }

    checkout.status = "COMPLETED";

    await checkout.save();

    await AuditService.log({

      entityType: "Checkout",

      entityId: checkout._id,

      action: "COMPLETE",

      performedBy: context.customerId,

      changes: [],

      ipAddress:
        context.ipAddress,

      userAgent:
        context.userAgent,

      requestId:
        context.requestId,

    });

    return checkout.toObject();

  }

  // =====================================================
  // Expire Checkout
  // =====================================================

  async expireCheckout(

    checkoutId,

    context

  ) {

    const checkout =
      await CheckoutRepository.findById(

        checkoutId,

        {

          lean: false,

        }

      );

    if (!checkout) {

      throw new Error(
        "Checkout not found."
      );

    }

    checkout.status = "EXPIRED";

    await checkout.save();

    await AuditService.log({

      entityType: "Checkout",

      entityId: checkout._id,

      action: "EXPIRE",

      performedBy:
        context.customerId,

      changes: [],

      ipAddress:
        context.ipAddress,

      userAgent:
        context.userAgent,

      requestId:
        context.requestId,

    });

    return checkout.toObject();

  }

  // =====================================================
  // Delete Checkout
  // =====================================================

  async deleteCheckout(

    checkoutId

  ) {

    const checkout =
      await CheckoutRepository.findById(

        checkoutId,

        {

          lean: false,

        }

      );

    if (!checkout) {

      throw new Error(
        "Checkout not found."
      );

    }

    await checkout.deleteOne();

    return true;

  }

}

export default new CheckoutService();