import api from "../lib/axios";

// =========================
// Customer Categories
// =========================

export const getCategories = () =>
  api.get("/categories");

export const getCategoryById = (
  id
) =>
  api.get(`/categories/${id}`);

export const getCategoryBySlug = (
  slug
) =>
  api.get(`/categories/slug/${slug}`);

// =========================
// Admin Categories
// =========================

export const getAdminCategories = (
  params = {}
) =>
  api.get(
    "/categories/admin/all",
    { params }
  );

export const getAdminCategoryStatistics = () =>
  api.get(
    "/categories/admin/statistics"
  );

export const createAdminCategory = (
  data
) =>
  api.post(
    "/categories",
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

export const updateAdminCategory = (
  id,
  data
) =>
  api.put(
    `/categories/${id}`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

export const deleteAdminCategory = (
  id
) =>
  api.delete(
    `/categories/${id}`
  );

export const restoreAdminCategory = (
  id
) =>
  api.patch(
    `/categories/${id}/restore`
  );

export const toggleAdminCategoryActive = (
  id
) =>
  api.patch(
    `/categories/${id}/toggle-active`
  );

export const toggleAdminCategoryFeatured = (
  id
) =>
  api.patch(
    `/categories/${id}/toggle-featured`
  );

export const updateAdminCategoryDisplayOrder = (
  id,
  displayOrder
) =>
  api.patch(
    `/categories/${id}/display-order`,
    { displayOrder }
  );

export const reorderAdminCategories = (
  categories
) =>
  api.patch(
    `/categories/reorder`,
    { categories }
  );