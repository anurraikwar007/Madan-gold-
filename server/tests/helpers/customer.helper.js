import request from "supertest";
import app from "../../src/app.js";

// ======================================
// Customer Login Helper
// ======================================

export async function customerLogin() {
  const unique = Date.now();

  const email = `jest${unique}@gmail.com`;
  const password = "Password@123";

  // Register Customer
  await request(app)
    .post("/api/v1/customers/register")
    .send({
      name: "Jest Customer",
      email,
      password,
      phone: `98765${unique.toString().slice(-5)}`,
    });

  // Login Customer
  const response = await request(app)
    .post("/api/v1/customers/login")
    .send({
      email,
      password,
    });

  return response.body.data.accessToken;
}

// ======================================
// Backward Compatibility
// ======================================

export async function createCustomerAndLogin() {
  return await customerLogin();
}