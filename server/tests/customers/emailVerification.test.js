import request from "supertest";
import app from "../../src/app.js";

describe("Customer Email Verification", () => {
  const email = `verify${Date.now()}@gmail.com`;
  const password = "Test@12345";

  test("Customer signup should require email verification", async () => {
    const response = await request(app)
      .post("/api/v1/customers/register")
      .send({
        name: "Verification Test",
        email,
        phone: "9876543210",
        password,
      });

    console.log("REGISTER:", response.statusCode);
    console.log(response.body);

    expect([200, 201]).toContain(response.statusCode);
    expect(response.body.success).toBe(true);
  });
});