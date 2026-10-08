import api from "../lib/axios";

// =====================================================
// Dashboard
// =====================================================

export const getAdminDashboard = (
  range = "all"
) =>
  api.get("/admin/dashboard", {
    params: { range },
  });

// =====================================================
// Products
// =====================================================

export const getAdminProducts = (
  params = {}
) =>
  api.get("/admin/products", {
    params,
  });

export const getAdminProduct = (id) =>
  api.get(`/admin/products/${id}`);

export const createAdminProduct = (
  data
) =>
  api.post("/admin/products", data);

export const updateAdminProduct = (
  id,
  data
) =>
  api.put(
    `/admin/products/${id}`,
    data
  );

export const toggleAdminProduct = (
  id
) =>
  api.patch(
    `/admin/products/${id}/toggle-active`
  );

export const deleteAdminProduct = (
  id
) =>
  api.delete(
    `/admin/products/${id}`
  );

export const uploadAdminProductImages = async (files) => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("images", file, file.name);
  });

  const token = localStorage.getItem("token");
  const apiBase = (import.meta.env.VITE_API_URL || "/api/v1").replace(/\/$/, "");

  // Use the browser fetch stack for multipart uploads. Do NOT set
  // Content-Type manually; fetch adds the correct multipart boundary.
  const response = await fetch(`${apiBase}/admin/products/upload-images`, {
    method: "POST",
    body: formData,
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const error = new Error(
      data?.message || data?.errors?.join?.(", ") || "Product image upload failed."
    );
    error.response = {
      status: response.status,
      data,
    };
    throw error;
  }

  return { data };
};

// =====================================================
// Categories
// =====================================================

export const getAdminCategories = (
  params = {}
) =>
  api.get("/admin/categories", {
    params,
  });

export const getAdminCategory = (id) =>
  api.get(`/admin/categories/${id}`);

export const createAdminCategory = (
  data
) =>
  api.post(
    "/admin/categories",
    data
  );

export const updateAdminCategory = (
  id,
  data
) =>
  api.put(
    `/admin/categories/${id}`,
    data
  );

export const toggleAdminCategory = (
  id
) =>
  api.patch(
    `/admin/categories/${id}/toggle-active`
  );

export const deleteAdminCategory = (
  id
) =>
  api.delete(
    `/admin/categories/${id}`
  );

// =====================================================
// Coupons
// =====================================================

export const getAdminCoupons = (
  params = {}
) =>
  api.get("/admin/coupons", {
    params,
  });

export const getAdminCoupon = (id) =>
  api.get(`/admin/coupons/${id}`);

export const createAdminCoupon = (
  data
) =>
  api.post("/admin/coupons", data);

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
  
  export const uploadAdminCouponImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file, file.name);
  const token = localStorage.getItem("token");
  const apiBase = (import.meta.env.VITE_API_URL || "/api/v1").replace(/\/$/, "");
  const response = await fetch(`${apiBase}/admin/coupons/upload-image`, {
    method: "POST",
    body: formData,
    credentials: "include",
    headers: { Accept: "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });
  let data = null; try { data = await response.json(); } catch {}
  if (!response.ok) { const error = new Error(data?.message || data?.errors?.join?.(", ") || "Coupon image upload failed."); error.response = { status: response.status, data }; throw error; }
  return { data };
};

// =====================================================
// Orders
// =====================================================

export const getAdminOrders = (
  params = {}
) =>
  api.get("/admin/orders", {
    params,
  });

export const getAdminOrder = (id) =>
  api.get(`/admin/orders/${id}`);

export const updateAdminOrderStatus = (
  id,
  status
) =>
  api.patch(
    `/admin/orders/${id}/status`,
    { status }
  );

// =====================================================
// Admin profile
// =====================================================

export const getAdminProfile = () =>
  api.get("/admin/me");

export const adminLogout = () =>
  api.post("/admin/logout");

export const adminLogoutAll = () =>
  api.post("/admin/logout-all");

// =====================================================
// Customers
// =====================================================

export const getAdminCustomers = (params = {}) =>
  api.get("/admin/customers", { params });

export const getAdminCustomer = (id) =>
  api.get(`/admin/customers/${id}`);

export const updateAdminCustomer = (id, data) =>
  api.put(`/admin/customers/${id}`, data);

export const toggleAdminCustomer = (id) =>
  api.patch(`/admin/customers/${id}/toggle-active`);

export const deleteAdminCustomer = (id) =>
  api.delete(`/admin/customers/${id}`);

export const restoreAdminCustomer = (id) =>
  api.patch(`/admin/customers/${id}/restore`);

export const getAdminCustomerStatistics = () =>
  api.get("/admin/customers/statistics");

// =====================================================
// Reviews
// =====================================================

export const getAdminReviews = (params = {}) =>
  api.get("/reviews/admin/all", { params });

export const updateAdminReviewApproval = (reviewId, isApproved) =>
  api.patch(`/reviews/admin/${reviewId}/approval`, { isApproved });

export const deleteAdminReview = (reviewId) =>
  api.delete(`/reviews/admin/${reviewId}`);
