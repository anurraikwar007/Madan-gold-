import api from "../lib/axios";

// =========================
// Customer Products
// =========================

export const getProducts = (params = {}) =>
  api.get("/products", {
    params,
  });

export const getProductById = (id) =>
  api.get(`/products/${id}`);

export const getFeaturedProducts = () =>
  api.get("/products?featured=true");

export const getBestSellerProducts = () =>
  api.get("/products?bestseller=true");

// =========================
// Admin Products
// =========================

export const getAdminProducts = (params = {}) =>
  api.get("/admin/products", {
    params,
  });

export const getAdminProductById = (id) =>
  api.get(`/admin/products/${id}`);

export const createAdminProduct = (data) =>
  api.post("/admin/products", data);

export const updateAdminProduct = (id, data) =>
  api.put(`/admin/products/${id}`, data);

export const deleteAdminProduct = (id) =>
  api.delete(`/admin/products/${id}`);

export const getRelatedProducts = (
  id
) =>
  api.get(
    `/products/${id}/related`
  );