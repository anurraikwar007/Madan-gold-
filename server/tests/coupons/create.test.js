import request from "supertest";
import app from "../../src/app.js";

import {
  adminLogin,
} from "../helpers/auth.helper.js";

describe("Create Coupon", () => {

  test("Create Coupon", async () => {

    const token =
      await adminLogin();

    const response =
      await request(app)
        .post("/api/v1/coupons")
        .set(
          "Authorization",
          `Bearer ${token}`
        )
        .send({
          code: `TEST${Date.now()}`,
          discountType: "Percentage",
          discountValue: 10,
          minimumOrderAmount: 500,
          validFrom: "2026-01-01",
          validTill: "2030-12-31",
          isActive: true
        });

    console.log(response.body);

    expect([200,201])
      .toContain(response.statusCode);

    expect(response.body.success)
      .toBe(true);

  });

});