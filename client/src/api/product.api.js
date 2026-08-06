import api from "../lib/axios";

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