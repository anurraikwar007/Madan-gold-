import request from "supertest";
import app from "../../src/app.js";

import { adminLogin } from "../helpers/auth.helper.js";
import { createProduct } from "../helpers/product.helper.js";

describe("Get Products", () => {

  test("Get All Products", async () => {

    const response = await request(app)
      .get("/api/v1/products");

    expect(response.statusCode).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.data).toHaveProperty("products");
    expect(response.body.data).toHaveProperty("pagination"); 

    expect(Array.isArray(response.body.data.products)).toBe(true);

  });

  test("Get Product By Id", async () => {

    const token = await adminLogin();

    const product = await createProduct(token);

    const response = await request(app)
      .get(`/api/v1/products/${product._id}`);

    expect(response.statusCode).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.data._id).toBe(product._id);

  });

});