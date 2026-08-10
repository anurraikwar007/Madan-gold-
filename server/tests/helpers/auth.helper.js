import request from "supertest";
import app from "../../src/app.js";

export async function adminLogin() {
  const response = await request(app)
    .post("/api/v1/auth/admin/login")
    .send({
      email: "admin@madangold.com",
      password: "12345678"
    });

  expect(response.statusCode).toBe(200);

  return response.body.data.accessToken;
}

export async function customerLogin() {

  const unique = Date.now();

  const email = `jest${unique}@gmail.com`;
  const password = "Password@123";

  // Register
  await request(app)
    .post("/api/v1/customers/register")
    .send({
      name: "Jest Customer",
      email,
      password,
      phone: `98765${unique.toString().slice(-5)}`
    });

  // Login
  const response = await request(app)
    .post("/api/v1/customers/login")
    .send({
      email,
      password
    });

  expect(response.statusCode).toBe(200);

  return response.body.data.accessToken;
}