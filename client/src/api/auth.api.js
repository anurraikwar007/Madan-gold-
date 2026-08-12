import api from "../lib/axios";

// =========================
// Customer
// =========================

export const login = (data) =>
  api.post("/customers/login", data);

export const register = (data) =>
  api.post("/customers/register", data);

export const resendVerification = (email) =>
  api.post("/customers/resend-verification", {
    email,
  });

export const getProfile = () =>
  api.get("/customers/profile");

export const logout = () =>
  api.post("/customers/logout");

export const logoutAll = () =>
  api.post("/customers/logout-all");

// =========================
// Admin
// =========================

export const adminLogin = (data) =>
  api.post("/admin/login", data);

export const adminGetProfile = () =>
  api.get("/admin/me");

export const adminLogout = () =>
  api.post("/admin/logout");

export const adminLogoutAll = () =>
  api.post("/admin/logout-all");

// =========================
// Refresh Token
// =========================

export const refreshToken = () =>
  api.post("/auth/refresh-token");