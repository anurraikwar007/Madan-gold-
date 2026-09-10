import api from "../lib/axios";

// =========================
// Customer
// =========================

export const login = (data) =>
  api.post("/customers/login", data);

export const register = (data) =>
  api.post("/customers/register", data);

export const verifyEmail = (email, otp) =>
  api.post("/customers/verify-email", { email, otp });

export const resendVerification = (email) =>
  api.post("/customers/resend-verification", { email });

export const forgotCustomerPassword = (
  email
) =>
  api.post(
    "/customers/forgot-password",
    { email }
  );

export const resetCustomerPassword = (
  token,
  password
) =>
  api.post(
    "/customers/reset-password",
    {
      token,
      password,
    }
  );

export const getProfile = () =>
  api.get("/customers/profile");

export const updateProfile = (data) =>
  api.put("/customers/profile", data);

export const changePassword = (data) =>
  api.put(
    "/customers/change-password",
    data
  );

export const getAddresses = () =>
  api.get("/customers/addresses");

export const addAddress = (data) =>
  api.post(
    "/customers/addresses",
    data
  );

export const updateAddress = (id, data) =>
  api.put(
    `/customers/addresses/${id}`,
    data
  );

export const deleteAddress = (id) =>
  api.delete(
    `/customers/addresses/${id}`
  );

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