import request from "supertest";
import app from "../../src/app.js";

import { customerLogin } from "../helpers/customer.helper.js";

describe("Get Orders", () => {

  test("Get Customer Orders", async () => {

    const token = await customerLogin();

    const response = await request(app)
      .get("/api/v1/orders")
      .set("Authorization", `Bearer ${token}`);

    console.log(response.body);

    expect(response.statusCode).toBe(200);

    expect(response.body.success).toBe(true);

  });

});