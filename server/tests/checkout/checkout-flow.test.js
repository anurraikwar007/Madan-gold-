import request from "supertest";

import app from "../../src/app.js";

import {
  customerLogin,
} from "../helpers/auth.helper.js";

import {
  createProduct,
} from "../helpers/product.helper.js";

import {
  addToCart,
} from "../helpers/cart.helper.js";

describe("Checkout Flow", () => {
  let accessToken;
  let checkoutId;

  beforeAll(async () => {
    // ======================================
    // Customer Login
    // ======================================

    accessToken =
      await customerLogin();

    // ======================================
    // Create Product
    // ======================================

    const product =
      await createProduct();

    // ======================================
    // Add Product To Cart
    // ======================================

    await addToCart(
      accessToken,
      product._id,
      1
    );
  });

  // ======================================
  // 1. Create Checkout
  // ======================================

  test("1. Create Checkout", async () => {
    const response =
      await request(app)
        .post("/api/v1/checkout")
        .set(
          "Authorization",
          `Bearer ${accessToken}`
        )
        .send({
          shippingAddress: {
            fullName: "Test Customer",
            phone: "9876543210",
            house: "101",
            area: "Test Area",
            city: "Shahdol",
            state: "Madhya Pradesh",
            country: "India",
            pincode: "484001",
            landmark: "",
          },
        });

    expect(response.statusCode)
      .toBe(201);

    expect(
      response.body.success
    ).toBe(true);

    expect(
      response.body.data
    ).toBeDefined();

    expect(
      response.body.data._id
    ).toBeDefined();

    checkoutId =
      response.body.data._id;
  });

  // ======================================
  // 2. Get Current Checkout
  // ======================================

  test(
    "2. Get Current Checkout",
    async () => {
      const response =
        await request(app)
          .get("/api/v1/checkout")
          .set(
            "Authorization",
            `Bearer ${accessToken}`
          );

      expect(response.statusCode)
        .toBe(200);

      expect(
        response.body.success
      ).toBe(true);

      expect(
        response.body.data._id
      ).toBe(checkoutId);
    }
  );

  // ======================================
  // 3. Get Checkout By Id
  // ======================================

  test(
    "3. Get Checkout By Id",
    async () => {
      const response =
        await request(app)
          .get(
            `/api/v1/checkout/${checkoutId}`
          )
          .set(
            "Authorization",
            `Bearer ${accessToken}`
          );

      expect(response.statusCode)
        .toBe(200);

      expect(
        response.body.success
      ).toBe(true);

      expect(
        response.body.data._id
      ).toBe(checkoutId);
    }
  );

  // ======================================
  // 4. Update Shipping Address
  // ======================================

  test(
    "4. Update Shipping Address",
    async () => {
      const response =
        await request(app)
          .put(
            `/api/v1/checkout/${checkoutId}/address`
          )
          .set(
            "Authorization",
            `Bearer ${accessToken}`
          )
          .send({
            fullName: "Updated Customer",
            phone: "9876543210",
            house: "202",
            area: "Updated Area",
            city: "Shahdol",
            state: "Madhya Pradesh",
            country: "India",
            pincode: "484001",
            landmark: "",
          });

      expect(response.statusCode)
        .toBe(200);

      expect(
        response.body.success
      ).toBe(true);

      expect(
        response.body.data.shippingAddress
          .fullName
      ).toBe("Updated Customer");
    }
  );

  // ======================================
  // 5. Delete Checkout
  // ======================================

  test(
    "5. Delete Checkout",
    async () => {
      const response =
        await request(app)
          .delete(
            `/api/v1/checkout/${checkoutId}`
          )
          .set(
            "Authorization",
            `Bearer ${accessToken}`
          );

      expect(response.statusCode)
        .toBe(200);

      expect(
        response.body.success
      ).toBe(true);
    }
  );
});