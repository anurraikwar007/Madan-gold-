import request from "supertest";
import app from "../../src/app.js";
import { adminLogin } from "../helpers/auth.helper.js";

describe("Get Coupons", () => {

  test("Get All Coupons", async () => {

    const token = await adminLogin();

    const response = await request(app)
      .get("/api/v1/coupons")
      .set("Authorization", `Bearer ${token}`);

    console.log(response.body);

    expect(response.statusCode).toBe(200);

    expect(response.body.success).toBe(true);

  });

});