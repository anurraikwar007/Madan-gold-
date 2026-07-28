import * as CouponService from "../services/coupon.service.js";

class CouponController {
  // =====================================================
  // Create Coupon
  // =====================================================

  async create(req, res, next) {
    try {
      const coupon = await CouponService.create(req.body);

      return res.status(201).json({
        success: true,
        message: "Coupon created successfully.",
        data: coupon,
      });
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // Update Coupon
  // =====================================================

  async update(req, res, next) {
    try {
      const coupon = await CouponService.update(
        req.params.id,
        req.body
      );

      return res.status(200).json({
        success: true,
        message: "Coupon updated successfully.",
        data: coupon,
      });
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // Delete Coupon
  // =====================================================

  async delete(req, res, next) {
    try {
      await CouponService.delete(req.params.id);

      return res.status(200).json({
        success: true,
        message: "Coupon deleted successfully.",
      });
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // Get Coupon By Id
  // =====================================================

  async getById(req, res, next) {
    try {
      const coupon = await CouponService.getById(
        req.params.id
      );

      return res.status(200).json({
        success: true,
        data: coupon,
      });
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // Get Coupon By Code
  // =====================================================

  async getByCode(req, res, next) {
    try {
      const coupon = await CouponService.getByCode(
        req.params.code
      );

      return res.status(200).json({
        success: true,
        data: coupon,
      });
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // List Coupons
  // =====================================================

  async getAll(req, res, next) {
    try {
      const {
        page = 1,
        limit = 10,
        search = "",
        isActive,
      } = req.query;

      const coupons =
        await CouponService.getAll({
          page: Number(page),
          limit: Number(limit),
          search,
          isActive,
        });

      return res.status(200).json({
        success: true,
        data: coupons,
      });
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // Validate Coupon
  // =====================================================

  async validate(req, res, next) {
    try {
      const result =
        await CouponService.validateCoupon(
          req.body
        );

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new CouponController();