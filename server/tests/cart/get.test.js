import request from "supertest";

import app from "../../src/app.js";

import {
  createCustomerAndLogin,
} from "../helpers/customer.helper.js";

describe("Get Cart", () => {

  test("Get Customer Cart", async () => {

    const token =
      await createCustomerAndLogin();

    const response =
      await request(app)
        .get("/api/v1/cart")
        .set(
          "Authorization",
          `Bearer ${token}`
        );

    console.log(response.body);

    expect(response.statusCode)
      .toBe(200);

    expect(response.body.success)
      .toBe(true);

  });

});