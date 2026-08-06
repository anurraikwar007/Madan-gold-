import api from "../lib/axios";

export const login = (data) =>
  api.post("/customers/login", data);

export const register = (data) =>
  api.post("/customers/register", data);

export const getProfile = () =>
  api.get("/customers/profile");

export const logout = () =>
  api.post("/customers/logout");