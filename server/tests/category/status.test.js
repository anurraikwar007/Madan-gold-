import request from "supertest";
import app from "../../src/app.js";

import { adminLogin } from "../helpers/auth.helper.js";
import { createProduct } from "../helpers/product.helper.js";

describe("Toggle Product Status", () => {

  test("Toggle Product Active Status", async () => {

    const token = await adminLogin();

    const product = await createProduct(token);

    const response = await request(app)
      .patch(`/api/v1/products/${product._id}/toggle-active`)
      .set("Authorization", `Bearer ${token}`);

    console.log(response.body);

    expect(response.statusCode).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.data).toHaveProperty("isActive");

  });

});