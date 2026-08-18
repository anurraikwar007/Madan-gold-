import api from "../lib/axios";

export const createCheckout = (payload) =>
  api.post("/checkout", payload);

export const getCheckout = () =>
  api.get("/checkout");