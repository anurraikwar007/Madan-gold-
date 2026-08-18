import api from "../lib/axios";

// =========================
// Customer Orders
// =========================

export const createOrder = (payload) =>
  api.post("/orders", payload);

export const getMyOrders = (
  params = {}
) =>
  api.get(
    "/orders/my-orders",
    { params }
  );

export const getMyOrderById = (
  id
) =>
  api.get(
    `/orders/${id}`
  );

export const cancelMyOrder = (
  id
) =>
  api.patch(
    `/orders/${id}/cancel`
  );

export const downloadMyInvoice = (
  id
) =>
  api.get(
    `/orders/${id}/invoice`,
    {
      responseType: "blob",
    }
  );

// =========================
// Admin Orders
// =========================

export const getAdminOrders = (
  params = {}
) =>
  api.get(
    "/admin/orders",
    { params }
  );

export const getAdminOrderById = (
  id
) =>
  api.get(
    `/admin/orders/${id}`
  );

export const updateAdminOrderStatus = (
  id,
  status
) =>
  api.patch(
    `/admin/orders/${id}/status`,
    { status }
);