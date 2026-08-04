import request from "supertest";
import app from "../../src/app.js";

import {
  createCustomerAndLogin,
} from "../helpers/customer.helper.js";

import {
  adminLogin,
} from "../helpers/auth.helper.js";

import {
  createProduct,
} from "../helpers/product.helper.js";

describe("Clear Cart", () => {

  test("Clear Customer Cart", async () => {

    // Customer Login
    const token =
      await createCustomerAndLogin();

    // Admin Login
    const adminToken =
      await adminLogin();

    // Create Product
    const product =
      await createProduct(adminToken);

    // Add Product To Cart
    await request(app)
      .post(`/api/v1/cart/${product._id}`)
      .set(
        "Authorization",
        `Bearer ${token}`
      )
      .send({
        quantity: 2,
      });

    // Clear Cart
    const response =
      await request(app)
        .delete("/api/v1/cart")
        .set(
          "Authorization",
          `Bearer ${token}`
        );

    console.log(response.statusCode);
    console.log(response.body);

    expect(response.statusCode)
      .toBe(200);

    expect(response.body.success)
      .toBe(true);

  });

});