import request from "supertest";
import app from "../../src/app.js";

import { adminLogin } from "../helpers/auth.helper.js";
import { customerLogin } from "../helpers/customer.helper.js";
import { createProduct } from "../helpers/product.helper.js";

describe("Remove Wishlist", () => {

  test("Remove Product From Wishlist", async () => {

    const adminToken = await adminLogin();

    const product = await createProduct(adminToken);

    const customerToken = await customerLogin();

    await request(app)
      .post(`/api/v1/wishlist/${product._id}`)
      .set("Authorization", `Bearer ${customerToken}`);

    const response = await request(app)
      .delete(`/api/v1/wishlist/${product._id}`)
      .set("Authorization", `Bearer ${customerToken}`);

    console.log(response.body);

    expect(response.statusCode).toBe(200);

    expect(response.body.success).toBe(true);

  });

});