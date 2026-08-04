import request from "supertest";
import app from "../../src/app.js";

import { adminLogin } from "../helpers/auth.helper.js";

describe("Create Category", () => {

  test("Create Category", async () => {

    const token = await adminLogin();

    const unique = Date.now();

    const response = await request(app)
      .post("/api/v1/categories")
      .set("Authorization", `Bearer ${token}`)
      .send({

        name: `Category ${unique}`,

        description: "Test Category",

        featured: false,

        displayOrder: 0

      });

    expect(response.statusCode).toBe(201);

    expect(response.body.success).toBe(true);

    expect(response.body.data.name)
      .toBe(`Category ${unique}`);

  });

});