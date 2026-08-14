import api from "../lib/axios";

// ===============================
// Dashboard
// ===============================

export const getAdminDashboard = () =>
  api.get("/admin/dashboard");

// ===============================
// Products
// ===============================

export const getAdminProducts = (params = {}) =>
  api.get("/admin/products", { params });

export const getAdminProduct = (id) =>
  api.get(`/admin/products/${id}`);

export const createAdminProduct = (data) =>
  api.post("/admin/products", data);

export const updateAdminProduct = (id, data) =>
  api.put(`/admin/products/${id}`, data);

export const deleteAdminProduct = (id) =>
  api.delete(`/admin/products/${id}`);

// ===============================
// Categories
// ===============================

export const getAdminCategories = () =>
  api.get("/admin/categories");

export const getAdminCategory = (id) =>
  api.get(`/admin/categories/${id}`);

export const createAdminCategory = (data) =>
  api.post("/admin/categories", data);

export const updateAdminCategory = (id, data) =>
  api.put(`/admin/categories/${id}`, data);

export const deleteAdminCategory = (id) =>
  api.delete(`/admin/categories/${id}`);

// ===============================
// Coupons
// ===============================

export const getAdminCoupons = () =>
  api.get("/admin/coupons");

export const getAdminCoupon = (id) =>
  api.get(`/admin/coupons/${id}`);

export const createAdminCoupon = (data) =>
  api.post("/admin/coupons", data);

export const updateAdminCoupon = (id, data) =>
  api.put(`/admin/coupons/${id}`, data);

export const deleteAdminCoupon = (id) =>
  api.delete(`/admin/coupons/${id}`);

// ===============================
// Orders
// ===============================

export const getAdminOrders = (params = {}) =>
  api.get("/admin/orders", { params });

export const getAdminOrder = (id) =>
  api.get(`/admin/orders/${id}`);

export const updateAdminOrderStatus = (id, status) =>
  api.patch(`/admin/orders/${id}/status`, { status });

// ===============================
// Profile
// ===============================

export const getAdminProfile = () =>
  api.get("/admin/me");

export const adminLogout = () =>
  api.post("/admin/logout");

export const adminLogoutAll = () =>
  api.post("/admin/logout-all");