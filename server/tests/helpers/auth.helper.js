import request from "supertest";
import app from "../../src/app.js";

// ======================================
// Admin Login
// ======================================

export async function adminLogin() {
  const response = await request(app)
    .post("/api/v1/auth/admin/login")
    .send({
      email: "admin@madangold.com",
      password: "12345678",
    });

  expect(response.statusCode).toBe(200);

  return response.body.data.accessToken;
}

// ======================================
// Customer Login
// ======================================

export async function customerLogin() {
  const unique = Date.now();

  const email = `jest${unique}@gmail.com`;
  const password = "Password@123";

  const phone =
    `98765${unique.toString().slice(-5)}`;

  // ======================================
  // Register
  // ======================================

  const registerResponse = await request(app)
    .post("/api/v1/customers/register")
    .send({
      name: "Jest Customer",
      email,
      password,
      phone,
    });

  expect([200, 201]).toContain(
    registerResponse.statusCode
  );

  // ======================================
  // Get OTP generated during test
  // ======================================

  const otp =
    global.__TEST_VERIFICATION_OTPS__?.[email];

  if (!otp) {
    throw new Error(
      `Verification OTP not found for ${email}`
    );
  }

  // ======================================
  // Verify Email
  // ======================================

  const verificationResponse =
    await request(app)
      .post("/api/v1/customers/verify-email")
      .send({
        email,
        otp,
      });

  expect(
    verificationResponse.statusCode
  ).toBe(200);

  expect(
    verificationResponse.body.success
  ).toBe(true);

  delete global.__TEST_VERIFICATION_OTPS__[email];

  // ======================================
  // Login
  // ======================================

  const response = await request(app)
    .post("/api/v1/customers/login")
    .send({
      email,
      password,
    });

  if (response.statusCode !== 200) {
    throw new Error(
      `Customer login failed: ${JSON.stringify(
        response.body
      )}`
    );
  }

  const accessToken =
    response.body?.data?.accessToken;

  if (!accessToken) {
    throw new Error(
      `Access token missing: ${JSON.stringify(
        response.body
      )}`
    );
  }

  return accessToken;
}
