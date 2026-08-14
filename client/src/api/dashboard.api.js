import api from "../lib/axios";

// =========================
// Admin Dashboard
// =========================

export const getAdminDashboard = (
  range = "all"
) =>
  api.get(
    "/admin/dashboard",
    {
      params: { range },
    }
  );

export const getDashboardAnalytics = () =>
  api.get("/dashboard/analytics");

export const getDashboardProducts = () =>
  api.get("/dashboard/products");

export const getDashboardCategories = () =>
  api.get("/dashboard/categories");

export const getDashboardOrders = () =>
  api.get("/dashboard/orders");

export const getDashboardRevenue = () =>
  api.get("/dashboard/revenue");

export const getDashboardCustomers = () =>
  api.get("/dashboard/customers");

export const getMonthlySales = () =>
  api.get("/dashboard/sales/monthly");

export const getRecentOrders = (
  limit = 10
) =>
  api.get(
    "/dashboard/orders/recent",
    {
      params: { limit },
    }
  );

export const getTopSellingProducts = (
  limit = 10
) =>
  api.get(
    "/dashboard/products/top-selling",
    {
      params: { limit },
    }
  );

export const getTopCustomers = (
  limit = 10
) =>
  api.get(
    "/dashboard/customers/top",
    {
      params: { limit },
    }
  );

export const getRevenueAnalytics = (
  range = "all"
) =>
  api.get(
    "/dashboard/revenue/analytics",
    {
      params: { range },
    }
  );

export const getSalesTrend = (
  range = "all"
) =>
  api.get(
    "/dashboard/sales/trend",
    {
      params: { range },
    }
  );

export const getDailyRevenue = (
  range = "all"
) =>
  api.get(
    "/dashboard/daily-revenue",
    {
      params: { range },
    }
  );