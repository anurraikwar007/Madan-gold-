import request from "supertest";
import app from "../../src/app.js";

import { adminLogin } from "../helpers/auth.helper.js";

describe("Update Order Status", () => {

  test("Admin Update Order Status", async () => {

    const token = await adminLogin();

    const orders = await request(app)
      .get("/api/v1/orders/admin")
      .set("Authorization", `Bearer ${token}`);

    if (!orders.body.data?.length) return;

    const orderId = orders.body.data[0]._id;

    const response = await request(app)
      .patch(`/api/v1/orders/${orderId}/status`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        status: "Processing"
      });

    console.log(response.body);

    expect(response.statusCode).toBe(200);

    expect(response.body.success).toBe(true);

  });

});