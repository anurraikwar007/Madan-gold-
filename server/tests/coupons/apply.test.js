import request from "supertest";
import app from "../../src/app.js";

import {
  createCustomerAndLogin,
} from "../helpers/customer.helper.js";

describe("Apply Coupon", () => {

  test("Apply Coupon", async () => {

    const token =
      await createCustomerAndLogin();

    const coupons =
      await request(app)
        .get("/api/v1/coupons");

    if (!coupons.body.data?.length) return;

    const response =
      await request(app)
        .post("/api/v1/coupons/apply")
        .set(
          "Authorization",
          `Bearer ${token}`
        )
        .send({
          code: coupons.body.data[0].code
        });

    console.log(response.body);

    expect([200,201])
      .toContain(response.statusCode);

    expect(response.body.success)
      .toBe(true);

  });

});