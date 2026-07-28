import CouponRepository from "../repositories/coupon.repository.js";

// ======================================================
// Create Coupon
// ======================================================

export const createCoupon = async (
  payload
) => {

  // ------------------------------------------
  // Duplicate Code Check
  // ------------------------------------------

  const existingCoupon =
    await CouponRepository.findByCode(
      payload.code
    );

  if (existingCoupon) {
    throw new Error(
      "Coupon code already exists."
    );
  }

  // ------------------------------------------
  // Date Validation
  // ------------------------------------------

  if (
    new Date(payload.validFrom) >=
    new Date(payload.validTill)
  ) {
    throw new Error(
      "Valid Till must be greater than Valid From."
    );
  }

  // ------------------------------------------
  // Discount Validation
  // ------------------------------------------

  if (
    payload.discountType ===
    "Percentage"
  ) {
    if (
      payload.discountValue <= 0 ||
      payload.discountValue > 100
    ) {
      throw new Error(
        "Percentage discount must be between 1 and 100."
      );
    }
  }

  if (
    payload.discountType === "Flat"
  ) {
    if (
      payload.discountValue <= 0
    ) {
      throw new Error(
        "Flat discount must be greater than 0."
      );
    }
  }

  // ------------------------------------------
  // Create Coupon
  // ------------------------------------------

  const coupon =
    await CouponRepository.create(
      payload
    );

  return coupon;
};

// ======================================================
// Get Coupon By ID
// ======================================================

export const getCouponById =
async (couponId) => {

  const coupon =
    await CouponRepository.findById(
      couponId
    );

  if (
    !coupon ||
    coupon.isDeleted
  ) {
    throw new Error(
      "Coupon not found."
    );
  }

  return coupon;
};

// ======================================================
// Get Coupon By Code
// ======================================================

export const getCouponByCode =
async (code) => {

  const coupon =
    await CouponRepository.findByCode(
      code
    );

  if (!coupon) {
    throw new Error(
      "Coupon not found."
    );
  }

  return coupon;
};
// ======================================================
// Get All Coupons
// ======================================================

export const getAllCoupons = async ({
  page = 1,
  limit = 10,
} = {}) => {

  return CouponRepository.paginate({
    filter: {
      isDeleted: false,
    },

    page,

    limit,

    sort: {
      createdAt: -1,
    },

    lean: true,
  });

};

// ======================================================
// Validate Coupon
// ======================================================

export const validateCoupon =
async (
  code,
  cartTotal
) => {

  const coupon =
    await CouponRepository.findByCode(
      code
    );

  if (!coupon) {
    throw new Error(
      "Invalid coupon."
    );
  }

  const now = new Date();

  // ----------------------------------
  // Active Check
  // ----------------------------------

  if (!coupon.isActive) {
    throw new Error(
      "Coupon is inactive."
    );
  }

  // ----------------------------------
  // Date Validation
  // ----------------------------------

  if (coupon.validFrom > now) {
    throw new Error(
      "Coupon is not active yet."
    );
  }

  if (coupon.validTill < now) {
    throw new Error(
      "Coupon has expired."
    );
  }

  // ----------------------------------
  // Usage Limit
  // ----------------------------------

  if (
    coupon.usedCount >=
    coupon.usageLimit
  ) {
    throw new Error(
      "Coupon usage limit exceeded."
    );
  }

  // ----------------------------------
  // Minimum Order
  // ----------------------------------

  if (
    cartTotal <
    coupon.minimumOrderAmount
  ) {
    throw new Error(
      `Minimum order amount should be ₹${coupon.minimumOrderAmount}.`
    );
  }

  return coupon;

};

// ======================================================
// Update Coupon
// ======================================================

export const updateCoupon =
async (
  couponId,
  payload
) => {

  const coupon =
    await CouponRepository.findById(
      couponId
    );

  if (
    !coupon ||
    coupon.isDeleted
  ) {
    throw new Error(
      "Coupon not found."
    );
  }

  // ----------------------------------
  // Duplicate Code
  // ----------------------------------

  if (
    payload.code &&
    payload.code !== coupon.code
  ) {

    const existing =
      await CouponRepository.findByCode(
        payload.code
      );

    if (
      existing &&
      existing._id.toString() !==
        couponId.toString()
    ) {
      throw new Error(
        "Coupon code already exists."
      );
    }

  }

  // ----------------------------------
  // Date Validation
  // ----------------------------------

  const validFrom =
    payload.validFrom ??
    coupon.validFrom;

  const validTill =
    payload.validTill ??
    coupon.validTill;

  if (
    new Date(validFrom) >=
    new Date(validTill)
  ) {
    throw new Error(
      "Valid Till must be greater than Valid From."
    );
  }

  Object.assign(
    coupon,
    payload
  );

  await coupon.save();

  return coupon;

};

// ======================================================
// Soft Delete Coupon
// ======================================================

export const deleteCoupon =
async (couponId) => {

  const coupon =
    await CouponRepository.findById(
      couponId
    );

  if (
    !coupon ||
    coupon.isDeleted
  ) {
    throw new Error(
      "Coupon not found."
    );
  }

  return CouponRepository.softDelete(
    couponId
  );

};

// ======================================================
// Restore Coupon
// ======================================================

export const restoreCoupon =
async (couponId) => {

  const coupon =
    await CouponRepository.findById(
      couponId
    );

  if (!coupon) {
    throw new Error(
      "Coupon not found."
    );
  }

  if (!coupon.isDeleted) {
    throw new Error(
      "Coupon is already active."
    );
  }

  return CouponRepository.restore(
    couponId
  );

};

// ======================================================
// Toggle Coupon Status
// ======================================================

export const toggleCouponStatus =
async (couponId) => {

  const coupon =
    await CouponRepository.findById(
      couponId
    );

  if (
    !coupon ||
    coupon.isDeleted
  ) {
    throw new Error(
      "Coupon not found."
    );
  }

  coupon.isActive =
    !coupon.isActive;

  await coupon.save();

  return coupon;

};

// ======================================================
// Active Coupons
// ======================================================

export const getActiveCoupons =
async () => {

  return CouponRepository.getActiveCoupons();

};

// ======================================================
// Expired Coupons
// ======================================================

export const getExpiredCoupons =
async () => {

  return CouponRepository.getExpiredCoupons();

};

// ======================================================
// Coupon Dashboard Statistics
// ======================================================

export const getCouponStatistics =
async () => {

  return CouponRepository.getStatistics();

};

// ======================================================
// Bulk Activate
// ======================================================

export const bulkActivateCoupons =
async (couponIds) => {

  return CouponRepository.bulkActivate(
    couponIds
  );

};

// ======================================================
// Bulk Deactivate
// ======================================================

export const bulkDeactivateCoupons =
async (couponIds) => {

  return CouponRepository.bulkDeactivate(
    couponIds
  );

};