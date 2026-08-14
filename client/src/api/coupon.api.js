import api from "../lib/axios";

// =========================
// Admin Coupons
// =========================

export const getAdminCoupons = (
  params = {}
) =>
  api.get(
    "/admin/coupons",
    { params }
  );

export const getAdminCouponById = (
  id
) =>
  api.get(
    `/admin/coupons/${id}`
  );

export const createAdminCoupon = (
  data
) =>
  api.post(
    "/admin/coupons",
    data
  );

export const updateAdminCoupon = (
  id,
  data
) =>
  api.put(
    `/admin/coupons/${id}`,
    data
  );

export const deleteAdminCoupon = (
  id
) =>
  api.delete(
    `/admin/coupons/${id}`
  );