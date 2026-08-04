import request from "supertest";
import app from "../../src/app.js";

import { adminLogin } from "../helpers/auth.helper.js";
import { createCategory } from "../helpers/category.helper.js";

describe("Toggle Featured Category", () => {

  test("Toggle Featured", async () => {

    const token = await adminLogin();

    const category = await createCategory(token);

    const response = await request(app)
      .patch(`/api/v1/categories/${category._id}/toggle-featured`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.data).toHaveProperty("featured");

  });

});