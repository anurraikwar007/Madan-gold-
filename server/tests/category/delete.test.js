import request from "supertest";
import app from "../../src/app.js";

import { adminLogin } from "../helpers/auth.helper.js";
import { createProduct } from "../helpers/product.helper.js";

describe("Delete Product", () => {

  test("Soft Delete Product", async () => {

    const token = await adminLogin();

    const product = await createProduct(token);

    const response = await request(app)
      .delete(`/api/v1/products/${product._id}`)
      .set("Authorization", `Bearer ${token}`);

    console.log(response.body);

    expect(response.statusCode).toBe(200);

    expect(response.body.success).toBe(true);

  });

});