import request from "supertest";
import app from "../../src/app.js";

import {
  adminLogin,
  customerLogin,
} from "../helpers/auth.helper.js";

import { createProduct } from "../helpers/product.helper.js";
import { addToCart } from "../helpers/cart.helper.js";

describe("Verify Payment", () => {
  test("Verify Payment", async () => {
    // Admin Login
    const adminToken = await adminLogin();

    // Create Product
    const product = await createProduct(adminToken);

    // Customer Login
    const customerToken = await customerLogin();

    // Add To Cart
    await addToCart(
      customerToken,
      product._id,
      1
    );

    // Create Order
    const orderResponse = await request(app)
      .post("/api/v1/orders")
      .set(
        "Authorization",
        `Bearer ${customerToken}`
      )
      .send({
        paymentMethod: "UPI",
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

    expect([200, 201]).toContain(
      orderResponse.statusCode
    );

    const order = orderResponse.body.data;

    // Submit Payment
    const submitResponse = await request(app)
      .post("/api/v1/payments/submit")
      .set(
        "Authorization",
        `Bearer ${customerToken}`
      )
      .send({
        orderId: order._id,
        transactionId: "TXN123456789",
      });

    expect([200, 201]).toContain(
      submitResponse.statusCode
    );

    // Verify Payment
    const verifyResponse = await request(app)
      .put(`/api/v1/payments/${order._id}/verify`)
      .set(
        "Authorization",
        `Bearer ${adminToken}`
      )
      .send({
        remark: "Payment Verified",
      });

    console.log(verifyResponse.body);

    expect([200, 201]).toContain(
      verifyResponse.statusCode
    );

    expect(
      verifyResponse.body.success
    ).toBe(true);
  });
});