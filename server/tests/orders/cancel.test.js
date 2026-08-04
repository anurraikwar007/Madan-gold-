import request from "supertest";
import app from "../../src/app.js";

import { customerLogin } from "../helpers/customer.helper.js";

describe("Cancel Order", () => {

  test("Cancel Customer Order", async () => {

    const token = await customerLogin();

    const orders = await request(app)
      .get("/api/v1/orders")
      .set("Authorization", `Bearer ${token}`);

    if (!orders.body.data?.length) return;

    const orderId = orders.body.data[0]._id;

    const response = await request(app)
      .patch(`/api/v1/orders/${orderId}/cancel`)
      .set("Authorization", `Bearer ${token}`);

    console.log(response.body);

    expect(response.statusCode).toBe(200);

    expect(response.body.success).toBe(true);

  });

});