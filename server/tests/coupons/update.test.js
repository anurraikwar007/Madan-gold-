import request from "supertest";
import app from "../../src/app.js";

import {
  adminLogin,
} from "../helpers/auth.helper.js";

describe("Update Coupon", () => {

  test("Update Coupon", async () => {

    const token =
      await adminLogin();

    const coupons =
      await request(app)
        .get("/api/v1/coupons")
        .set(
          "Authorization",
          `Bearer ${token}`
        );

    if (!coupons.body.data?.length) return;

    const coupon =
      coupons.body.data[0];

    const response =
      await request(app)
        .put(`/api/v1/coupons/${coupon._id}`)
        .set(
          "Authorization",
          `Bearer ${token}`
        )
        .send({
          discountValue: 20
        });

    console.log(response.body);

    expect(response.statusCode)
      .toBe(200);

    expect(response.body.success)
      .toBe(true);

  });

});