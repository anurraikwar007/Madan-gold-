import request from "supertest";
import app from "../../src/app.js";

import { customerLogin } from "../helpers/customer.helper.js";
import { adminLogin } from "../helpers/auth.helper.js";
import { createProduct } from "../helpers/product.helper.js";

describe("Add Wishlist", () => {

  test("Add Product To Wishlist", async () => {

    const adminToken = await adminLogin();

    const product = await createProduct(adminToken);

    const customerToken = await customerLogin();

    const response = await request(app)
      .post(`/api/v1/wishlist/${product._id}`)
      .set("Authorization", `Bearer ${customerToken}`);

    console.log(response.body);

    expect([200, 201]).toContain(response.statusCode);

    expect(response.body.success).toBe(true);

  });

});