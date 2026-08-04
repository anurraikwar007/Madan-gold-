import request from "supertest";
import app from "../../src/app.js";

import {
  adminLogin,
  customerLogin,
} from "../helpers/auth.helper.js";

import { createProduct } from "../helpers/product.helper.js";
import { addToCart } from "../helpers/cart.helper.js";

describe("Create Order", () => {

  test("Create New Order", async () => {

    const adminToken = await adminLogin();

    const product = await createProduct(adminToken);

    const customerToken = await customerLogin();

    await addToCart(
      customerToken,
      product._id,
      1
    );

    const response = await request(app)
      .post("/api/v1/orders")
      .set(
        "Authorization",
        `Bearer ${customerToken}`
      )
      .send({
        paymentMethod: "COD",

        shippingAddress: {
          fullName: "Test User",
          phone: "9999999999",
          house: "House 10",
          area: "MG Road",
          city: "Indore",
          state: "MP",
          pincode: "452001",
        },
      });

    console.log(response.body);

    expect([200, 201]).toContain(response.statusCode);

    expect(response.body.success).toBe(true);

  });

});