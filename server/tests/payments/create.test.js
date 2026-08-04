import { jest } from "@jest/globals";

import request from "supertest";
import app from "../../src/app.js";

import {
  adminLogin,
  customerLogin,
} from "../helpers/auth.helper.js";

import { createProduct } from "../helpers/product.helper.js";
import { addToCart } from "../helpers/cart.helper.js";

jest.setTimeout(30000);

describe("Create Payment", () => {
  test(
    "Create Payment Intent",
    async () => {
      // ==========================
      // Admin Login
      // ==========================

      const adminToken = await adminLogin();

      // ==========================
      // Create Product
      // ==========================

      const product = await createProduct(adminToken);

      expect(product).toBeDefined();
      expect(product._id).toBeDefined();

      // ==========================
      // Customer Login
      // ==========================

      const customerToken = await customerLogin();

      expect(customerToken).toBeDefined();

      // ==========================
      // Add To Cart
      // ==========================

      await addToCart(
        customerToken,
        product._id,
        1
      );

      // ==========================
      // Create Order
      // ==========================

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

      console.log("ORDER STATUS:", orderResponse.statusCode);
      console.log(
        "ORDER RESPONSE:",
        JSON.stringify(orderResponse.body, null, 2)
      );

      expect(orderResponse.statusCode).toBe(201);
      expect(orderResponse.body.success).toBe(true);

      const order = orderResponse.body.data;

      expect(order).toBeDefined();
      expect(order._id).toBeDefined();

      // ==========================
      // Submit Payment
      // ==========================

      const paymentResponse = await request(app)
        .post("/api/v1/payments/submit")
        .set(
          "Authorization",
          `Bearer ${customerToken}`
        )
        .send({
          orderId: order._id,
          transactionId: "TXN123456789",
        });

      console.log(
        "PAYMENT STATUS:",
        paymentResponse.statusCode
      );

      console.log(
        "PAYMENT RESPONSE:",
        JSON.stringify(paymentResponse.body, null, 2)
      );

      expect([200, 201]).toContain(
        paymentResponse.statusCode
      );

      expect(paymentResponse.body.success).toBe(true);

      expect(
        paymentResponse.body.data.transactionId
      ).toBe("TXN123456789");

      expect(
        paymentResponse.body.data.paymentStatus
      ).toBe("Verification Pending");
    },
    30000
  );
});