import request from "supertest";
import app from "../../src/app.js";

import { adminLogin } from "../helpers/auth.helper.js";
import { createCategory } from "../helpers/category.helper.js";

describe("Get Category", () => {

  test("Get Category By Id", async () => {

    const token = await adminLogin();

    const category =
      await createCategory(token);

    const response = await request(app)
      .get(`/api/v1/categories/${category._id}`);

    expect(response.statusCode).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.data._id)
      .toBe(category._id);

  });

  test("Get Active Categories", async () => {

    const response = await request(app)
      .get("/api/v1/categories");

    expect(response.statusCode).toBe(200);

    expect(response.body.success).toBe(true);

    expect(Array.isArray(response.body.data))
      .toBe(true);

  });

});