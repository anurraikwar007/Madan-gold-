import api from "../lib/axios";

export const getCategories = () =>
  api.get("/categories");

export const featuredCategories = () =>
  api.get("/categories/featured");