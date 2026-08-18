
import mongoose from "mongoose";

import CheckoutRepository from "../repositories/checkout.repository.js";
import CartRepository from "../repositories/cart.repository.js";
import ProductRepository from "../repositories/product.repository.js";
import CouponRepository from "../repositories/coupon.repository.js";

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

        const sellingPrice =
        product.discountPrice > 0 &&
        product.discountPrice < product.price
          ? product.discountPrice
          : product.price;

      const itemSubtotal =
        cartItem.quantity *
        sellingPrice;
        const itemMaking =
          (product.makingCharges || 0) *
          cartItem.quantity;

        const itemGST =
          (
            itemSubtotal +
            itemMaking
          ) *
          ((product.gst || 0) / 100);

        checkoutItems.push({

          product: product._id,

          name: product.name,

          quantity: cartItem.quantity,

          price: sellingPrice,

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

      const couponCode =
        dto.couponCode;

      let coupon = null;

      if (couponCode) {

        coupon =
          await CouponRepository.findOne(
            {
              code:
                couponCode
                  .trim()
                  .toUpperCase(),

              isActive: true,

              isDeleted: false,
            },
            {
              session,
            }
          );

        if (!coupon) {

          throw new Error(
            "Invalid coupon."
          );

        }

        const now = new Date();

          if (
            (coupon.validFrom &&
              now < coupon.validFrom) ||
            (coupon.validTill &&
              now > coupon.validTill)
          ) {
            throw new Error(
              "Coupon is expired or not active yet."
            );
          }

        if (
          coupon.minimumOrderAmount &&
          subtotal <
            coupon.minimumOrderAmount
        ) {

          throw new Error(
            `Minimum order amount should be ₹${coupon.minimumOrderAmount}.`
          );

        }

        if (
          coupon.usageLimit &&
          coupon.usedCount >=
            coupon.usageLimit
        ) {

          throw new Error(
            "Coupon usage limit exceeded."
          );

        }

        if (
          coupon.discountType ===
          "Percentage"
        ) {

          discount =
            (subtotal *
              coupon.discountValue) /
            100;

          if (
            coupon.maximumDiscount &&
            discount >
              coupon.maximumDiscount
          ) {

            discount =
              coupon.maximumDiscount;

          }

        } else {

          discount =
            coupon.discountValue;

        }

        discount =
          Math.min(
            discount,
            subtotal
          );

      }

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

        performedByModel:
          "Customer",

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

        session,

      });

      // ==========================================
      // Commit Transaction
      // ==========================================

      await session.commitTransaction();

      return checkout.toObject();

    } catch (error) {

      if (
        session.inTransaction()
      ) {

        await session.abortTransaction();

      }

      throw error;

    } finally {

      await session.endSession();

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
    customerId,
    checkoutId
  ) {

    const checkout =
      await CheckoutRepository.findOne(

        {
          _id: checkoutId,

          customer: customerId,
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
  // Update Shipping Address
  // =====================================================

  async updateShippingAddress(

    customerId,

    checkoutId,

    shippingAddress,

    context

  ) {

    const session =
      await mongoose.startSession();

    session.startTransaction();

    try {

      const checkout =
        await CheckoutRepository.findOne(

          {

            _id: checkoutId,

            customer: customerId,

            status: "PENDING",

          },

          {

            lean: false,

            session,

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

      await checkout.save({
        session,
      });

      await AuditService.log({

        entityType: "Checkout",

        entityId: checkout._id,

        action: "UPDATE",

        performedBy: customerId,

        performedByModel:
          "Customer",

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

        session,

      });

      await session.commitTransaction();

      return checkout.toObject();

    } catch (error) {

      if (
        session.inTransaction()
      ) {

        await session.abortTransaction();

      }

      throw error;

    } finally {

      await session.endSession();

    }

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

    const session =
      await mongoose.startSession();

    session.startTransaction();

    try {

      const checkout =
        await CheckoutRepository.findOne(

          {

            _id: checkoutId,

            customer: customerId,

            status: "PENDING",

          },

          {

            lean: false,

            session,

          }

        );

      if (!checkout) {

        throw new Error(
          "Checkout not found."
        );

      }

      // =====================================================
      // Coupon Module
      // =====================================================

      const couponCode =
        typeof coupon === "string"
          ? coupon
          : coupon?.code;

      if (!couponCode) {

        throw new Error(
          "Coupon code is required."
        );

      }

      const couponData =
        await CouponRepository.findByCode(
          couponCode,
          {
            session,
          }
        );

      if (!couponData) {

        throw new Error(
          "Invalid coupon."
        );

      }

      const now = new Date();

      if (!couponData.isActive) {

        throw new Error(
          "Coupon is inactive."
        );

      }

      if (
        couponData.isDeleted
      ) {

        throw new Error(
          "Coupon is deleted."
        );

      }

      if (
        now < couponData.validFrom ||
        now > couponData.validTill
      ) {

        throw new Error(
          "Coupon is expired or not active yet."
        );

      }

      if (
        couponData.usageLimit &&
        couponData.usedCount >=
          couponData.usageLimit
      ) {

        throw new Error(
          "Coupon usage limit exceeded."
        );

      }

      if (
        checkout.subtotal <
        couponData.minimumOrderAmount
      ) {

        throw new Error(
          `Minimum order amount should be ₹${couponData.minimumOrderAmount}.`
        );

      }

      let discount = 0;

      if (
        couponData.discountType ===
        "Percentage"
      ) {

        discount =
          (
            checkout.subtotal *
            couponData.discountValue
          ) / 100;

        if (
          couponData.maximumDiscount > 0
        ) {

          discount = Math.min(
            discount,
            couponData.maximumDiscount
          );

        }

      } else {

        discount =
          couponData.discountValue;

      }

      discount = Math.min(
        discount,
        checkout.subtotal
      );

      checkout.coupon =
        couponData._id;

      checkout.discount =
        discount;

      checkout.grandTotal =
        checkout.subtotal +
        checkout.makingCharge +
        checkout.gst +
        checkout.shippingCharge -
        discount;

      await checkout.save({
        session,
      });

      await AuditService.log({

        entityType: "Checkout",

        entityId: checkout._id,

        action: "COUPON_APPLY",

        performedBy: customerId,

        performedByModel:
          "Customer",

        changes: [

          {

            field: "coupon",

            oldValue: null,

            newValue: couponData._id,

          },

          {

            field: "discount",

            oldValue: 0,

            newValue: discount,

          },

        ],

        ipAddress:
          context.ipAddress,

        userAgent:
          context.userAgent,

        requestId:
          context.requestId,

        session,

      });

      await session.commitTransaction();

      return checkout.toObject();

    } catch (error) {

      if (
        session.inTransaction()
      ) {

        await session.abortTransaction();

      }

      throw error;

    } finally {

      await session.endSession();

    }

  }

  // =====================================================
  // Remove Coupon
  // =====================================================

  async removeCoupon(

    customerId,

    checkoutId,

    context

  ) {

    const session =
      await mongoose.startSession();

    session.startTransaction();

    try {

      const checkout =
        await CheckoutRepository.findOne(

          {

            _id: checkoutId,

            customer: customerId,

            status: "PENDING",

          },

          {

            lean: false,

            session,

          }

        );

      if (!checkout) {

        throw new Error(
          "Checkout not found."
        );

      }

      const oldCoupon =
        checkout.coupon;

      const oldDiscount =
        checkout.discount;

      checkout.coupon = null;

      checkout.discount = 0;

      checkout.grandTotal =

        checkout.subtotal +

        checkout.makingCharge +

        checkout.gst +

        checkout.shippingCharge;

      await checkout.save({
        session,
      });

      await AuditService.log({

        entityType: "Checkout",

        entityId: checkout._id,

        action: "COUPON_REMOVE",

        performedBy: customerId,

        performedByModel:
          "Customer",

        changes: [

          {

            field: "coupon",

            oldValue: oldCoupon,

            newValue: null,

          },

          {

            field: "discount",

            oldValue: oldDiscount,

            newValue: 0,

          },

        ],

        ipAddress:
          context.ipAddress,

        userAgent:
          context.userAgent,

        requestId:
          context.requestId,

        session,

      });

      await session.commitTransaction();

      return checkout.toObject();

    } catch (error) {

      if (
        session.inTransaction()
      ) {

        await session.abortTransaction();

      }

      throw error;

    } finally {

      await session.endSession();

    }

  }

  // =====================================================
  // Recalculate Checkout
  // =====================================================

  async recalculateCheckout(

    checkoutId,

    context

  ) {

    const session =
      await mongoose.startSession();

    session.startTransaction();

    try {

      const checkout =
        await CheckoutRepository.findOne(

          {

            _id: checkoutId,

            customer:
              context.customerId,

            status: "PENDING",

          },

          {

            lean: false,

            session,

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

      await checkout.save({
        session,
      });

      await session.commitTransaction();

      return checkout.toObject();

    } catch (error) {

      if (
        session.inTransaction()
      ) {

        await session.abortTransaction();

      }

      throw error;

    } finally {

      await session.endSession();

    }

  }

  // =====================================================
  // Complete Checkout
  // =====================================================

  async completeCheckout(

    checkoutId,

    context

  ) {

    const session =
      await mongoose.startSession();

    session.startTransaction();

    try {

      const checkout =
        await CheckoutRepository.findOne(

          {

            _id: checkoutId,

            customer:
              context.customerId,

            status: "PENDING",

          },

          {

            lean: false,

            session,

          }

        );

      if (!checkout) {

        throw new Error(
          "Checkout not found."
        );

      }

      if (
        !checkout.customer ||
        checkout.customer.toString() !==
          context.customerId.toString()
      ) {

        throw new Error(
          "You are not authorized to complete this checkout."
        );

      }

      checkout.status =
        "COMPLETED";

      await checkout.save({
        session,
      });

      await AuditService.log({

        entityType: "Checkout",

        entityId: checkout._id,

        action: "COMPLETE",

        performedBy:
          context.customerId,

        performedByModel:
          "Customer",

        changes: [

          {

            field: "status",

            oldValue: "PENDING",

            newValue: "COMPLETED",

          },

        ],

        ipAddress:
          context.ipAddress,

        userAgent:
          context.userAgent,

        requestId:
          context.requestId,

        session,

      });

      await session.commitTransaction();

      return checkout.toObject();

    } catch (error) {

      if (
        session.inTransaction()
      ) {

        await session.abortTransaction();

      }

      throw error;

    } finally {

      await session.endSession();

    }

  }

  // =====================================================
  // Expire Checkout
  // =====================================================

  async expireCheckout(

    checkoutId,

    context

  ) {

    const session =
      await mongoose.startSession();

    session.startTransaction();

    try {

      const checkout =
        await CheckoutRepository.findOne(

          {

            _id: checkoutId,

            customer:
              context.customerId,

            status: "PENDING",

          },

          {

            lean: false,

            session,

          }

        );

      if (!checkout) {

        throw new Error(
          "Checkout not found."
        );

      }

      checkout.status =
        "EXPIRED";

      await checkout.save({
        session,
      });

      await AuditService.log({

        entityType: "Checkout",

        entityId: checkout._id,

        action: "EXPIRE",

        performedBy:
          context.customerId,

        performedByModel:
          "Customer",

        changes: [

          {

            field: "status",

            oldValue: "PENDING",

            newValue: "EXPIRED",

          },

        ],

        ipAddress:
          context.ipAddress,

        userAgent:
          context.userAgent,

        requestId:
          context.requestId,

        session,

      });

      await session.commitTransaction();

      return checkout.toObject();

    } catch (error) {

      if (
        session.inTransaction()
      ) {

        await session.abortTransaction();

      }

      throw error;

    } finally {

      await session.endSession();

    }

  }

  // =====================================================
  // Delete Checkout
  // =====================================================

  async deleteCheckout(

    checkoutId,

    customerId

  ) {

    const session =
      await mongoose.startSession();

    session.startTransaction();

    try {

      const checkout =
        await CheckoutRepository.findOne(

          {

            _id: checkoutId,

            customer: customerId,

          },

          {

            lean: false,

            session,

          }

        );

      if (!checkout) {

        throw new Error(
          "Checkout not found."
        );

      }

      await checkout.deleteOne({
        session,
      });

      await AuditService.log({

        entityType: "Checkout",

        entityId: checkout._id,

        action: "DELETE",

        performedBy:
          customerId,

        performedByModel: 
          "Customer",

        changes: [

          {

            field: "DELETE",

            oldValue: checkout,

            newValue: null,

          },

        ],

        session,

      });

      await session.commitTransaction();

      return true;

    } catch (error) {

      if (
        session.inTransaction()
      ) {

        await session.abortTransaction();

      }

      throw error;

    } finally {

      await session.endSession();

    }

  }

}

export default new CheckoutService();