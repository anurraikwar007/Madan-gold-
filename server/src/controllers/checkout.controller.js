import asyncHandler from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";

import CheckoutService from "../services/checkout.service.js";

class CheckoutController {

  // =====================================================
  // Create Checkout
  // =====================================================

  create = asyncHandler(async (req, res) => {

    const checkout =
      await CheckoutService.createCheckout(

        req.user.id,

        req.body,

        {

          customerId: req.user.id,

          ipAddress: req.ip,

          userAgent: req.get("user-agent"),

          requestId: req.requestId,

        }

      );

    return res.status(201).json(

      apiResponse.success(

        "Checkout created successfully.",

        checkout

      )

    );

  });

  // =====================================================
  // Get Customer Checkout
  // =====================================================

  get = asyncHandler(async (req, res) => {

    const checkout =
      await CheckoutService.getCheckout(

        req.user.id

      );

    return res.status(200).json(

      apiResponse.success(

        "Checkout fetched successfully.",

        checkout

      )

    );

  });

  // =====================================================
  // Get Checkout By Id
  // =====================================================

  getById = asyncHandler(async (req, res) => {

  const checkout =
    await CheckoutService.getCheckoutById(
      req.user.id,
      req.params.id
    );

  return res.status(200).json(
    apiResponse.success(
      "Checkout fetched successfully.",
      checkout
    )
  );
});
  
    // =====================================================
  // Update Shipping Address
  // =====================================================

  updateShippingAddress =
    asyncHandler(async (req, res) => {

      const checkout =
        await CheckoutService.updateShippingAddress(

          req.user.id,

          req.params.id,

          req.body,

          {

            customerId: req.user.id,

            ipAddress: req.ip,

            userAgent: req.get("user-agent"),

            requestId: req.requestId,

          }

        );

      return res.status(200).json(

        apiResponse.success(

          "Shipping address updated successfully.",

          checkout

        )

      );

    });

  // =====================================================
  // Apply Coupon
  // =====================================================

  applyCoupon =
    asyncHandler(async (req, res) => {

      const checkout =
        await CheckoutService.applyCoupon(

          req.user.id,

          req.params.id,

          req.body,

          {

            customerId: req.user.id,

            ipAddress: req.ip,

            userAgent: req.get("user-agent"),

            requestId: req.requestId,

          }

        );

      return res.status(200).json(

        apiResponse.success(

          "Coupon applied successfully.",

          checkout

        )

      );

    });

  // =====================================================
  // Remove Coupon
  // =====================================================

  removeCoupon =
    asyncHandler(async (req, res) => {

      const checkout =
        await CheckoutService.removeCoupon(

          req.user.id,

          req.params.id,

          {

            customerId: req.user.id,

            ipAddress: req.ip,

            userAgent: req.get("user-agent"),

            requestId: req.requestId,

          }

        );

      return res.status(200).json(

        apiResponse.success(

          "Coupon removed successfully.",

          checkout

        )

      );

    });
      // =====================================================
  // Complete Checkout
  // =====================================================

  complete =
    asyncHandler(async (req, res) => {

      const checkout =
        await CheckoutService.completeCheckout(

          req.params.id,

          {

            customerId: req.user.id,

            ipAddress: req.ip,

            userAgent: req.get("user-agent"),

            requestId: req.requestId,

          }

        );

      return res.status(200).json(

        apiResponse.success(

          "Checkout completed successfully.",

          checkout

        )

      );

    });

  // =====================================================
  // Expire Checkout
  // =====================================================

  expire =
    asyncHandler(async (req, res) => {

      const checkout =
        await CheckoutService.expireCheckout(

          req.params.id,

          {

            customerId: req.user.id,

            ipAddress: req.ip,

            userAgent: req.get("user-agent"),

            requestId: req.requestId,

          }

        );

      return res.status(200).json(

        apiResponse.success(

          "Checkout expired successfully.",

          checkout

        )

      );

    });

  // =====================================================
  // Delete Checkout
  // =====================================================

  remove =
    asyncHandler(async (req, res) => {

      await CheckoutService.deleteCheckout(

        req.params.id,
        req.user.id

      );

      return res.status(200).json(

        apiResponse.success(

          "Checkout deleted successfully."

        )

      );

    });

}

export default new CheckoutController();