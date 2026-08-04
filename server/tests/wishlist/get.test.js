import request from "supertest";
import app from "../../src/app.js";

import { customerLogin } from "../helpers/customer.helper.js";

describe("Get Wishlist", () => {

  test("Get Customer Wishlist", async () => {

    const token = await customerLogin();

    const response = await request(app)
      .get("/api/v1/wishlist")
      .set("Authorization", `Bearer ${token}`);

    console.log(response.body);

    expect(response.statusCode).toBe(200);

    expect(response.body.success).toBe(true);

  });

  test("Wishlist Count", async () => {

    const token = await customerLogin();

    const response = await request(app)
      .get("/api/v1/wishlist/count")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

    expect(response.body.success).toBe(true);

  });

});