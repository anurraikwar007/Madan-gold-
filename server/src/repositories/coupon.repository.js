import BaseRepository from "./base.repository.js";
import Coupon from "../models/coupon.model.js";

class CouponRepository extends BaseRepository {
  constructor() {
    super(Coupon);
  }

  // =====================================================
  // Find By Code
  // =====================================================

  async findByCode(code) {
    return this.findOne({
      code: code.toUpperCase().trim(),
      isActive: true,
      isDeleted: false,
    });
  }

  // =====================================================
  // Validate Coupon
  // =====================================================

  async validateCoupon(code) {
    return Coupon.findOne({
      code: code.toUpperCase().trim(),
      isActive: true,
      isDeleted: false,
    }).lean();
  }

  // =====================================================
  // Increase Usage
  // =====================================================

  async increaseUsage(
    couponId,
    session = null
  ) {
   return Coupon.findOneAndUpdate(
  {
    _id: couponId,
    isActive: true,
    isDeleted: false,
    $or: [
      {
        usageLimit: {
          $exists: false,
        },
      },
      {
        usageLimit: 0,
      },
      {
        $expr: {
          $lt: [
            "$usedCount",
            "$usageLimit",
          ],
        },
      },
    ],
  },
  {
    $inc: {
      usedCount: 1,
    },
  },
  {
    returnDocument: "after",
    session,
  }
);
  }

  // =====================================================
  // Decrease Usage
  // =====================================================

  async decreaseUsage(
  couponId,
  session = null
  ) {
  return Coupon.findOneAndUpdate(
    {
      _id: couponId,
      usedCount: {
        $gt: 0,
      },
    },
    {
      $inc: {
        usedCount: -1,
      },
    },
    {
      returnDocument: "after",
      session,
    }
  );
}
  // =====================================================
  // Get Active Coupons
  // =====================================================

  async getActiveCoupons() {
  const now = new Date();

  return Coupon.find({
    isActive: true,
    isDeleted: false,

    validFrom: {
      $lte: now,
    },

    validTill: {
      $gte: now,
    },

    $expr: {
      $lt: [
        "$usedCount",
        "$usageLimit",
      ],
    },
  })
    .sort({
      createdAt: -1,
    })
    .lean();
 }

  // =====================================================
  // Get Expired Coupons
  // =====================================================

    async getExpiredCoupons() {
      return Coupon.find({
        validTill: {
          $lt: new Date(),
        },
        isDeleted: false,
      }).lean();
    }
  // =====================================================
  // Bulk Activate
  // =====================================================

  async bulkActivate(ids) {
    return Coupon.updateMany(
      {
        _id: {
          $in: ids,
        },
      },
      {
        $set: {
          isActive: true,
        },
      }
    );
  }

  // =====================================================
  // Bulk Deactivate
  // =====================================================

  async bulkDeactivate(ids) {
    return Coupon.updateMany(
      {
        _id: {
          $in: ids,
        },
      },
      {
        $set: {
          isActive: false,
        },
      }
    );
  }

  // =====================================================
  // Soft Delete
  // =====================================================

  async softDelete(id) {
    return Coupon.findByIdAndUpdate(
      id,
      {
        $set: {
          isDeleted: true,
          isActive: false,
        },
      },
      {
         returnDocument: "after",
      }
    );
  }

  // =====================================================
  // Restore Coupon
  // =====================================================

  async restore(id) {
    return Coupon.findByIdAndUpdate(
      id,
      {
        $set: {
          isDeleted: false,
          isActive: true,
        },
      },
      {
         returnDocument: "after",
      }
    );
  }

  // =====================================================
  // Dashboard Statistics
  // =====================================================

  async getStatistics() {
    const [
      totalCoupons,
      activeCoupons,
      inactiveCoupons,
      expiredCoupons,
    ] = await Promise.all([
      Coupon.countDocuments({
        isDeleted: false,
      }),

      Coupon.countDocuments({
        isDeleted: false,
        isActive: true,
      }),

      Coupon.countDocuments({
        isDeleted: false,
        isActive: false,
      }),

      Coupon.countDocuments({
        validTill: {
          $lt: new Date(),
        },
        isDeleted: false,
      }),
    ]);

    return {
      totalCoupons,
      activeCoupons,
      inactiveCoupons,
      expiredCoupons,
    };
  }
}

export default new CouponRepository();