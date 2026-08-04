import request from "supertest";
import app from "../../src/app.js";

describe("Customer Register", () => {

  test("Register Customer", async () => {

    const unique = Date.now();

    const response = await request(app)
      .post("/api/v1/customers/register")
      .send({

        name: "Jest User",

        email: `jest${unique}@gmail.com`,

        password: "Password@123",

        phone: `98765${unique.toString().slice(-5)}`

      });

    console.log(response.body);

    expect([200,201]).toContain(response.statusCode);

    expect(response.body.success).toBe(true);

  });

});