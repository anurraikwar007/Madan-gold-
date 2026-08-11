import request from "supertest";
import app from "../../src/app.js";

// ======================================
// Customer Login Helper
// ======================================

export async function customerLogin() {
  const unique = Date.now();

  const email = `jest${unique}@gmail.com`;
  const password = "Password@123";

  await request(app)
    .post("/api/v1/customers/register")
    .send({
      name: "Jest Customer",
      email,
      password,
      phone: `98765${unique.toString().slice(-5)}`,
    });

  const otp =
    global.__TEST_VERIFICATION_OTPS__?.[email];

  if (!otp) {
    throw new Error(
      `Verification OTP not found for ${email}`
    );
  }

  const verificationResponse =
    await request(app)
      .post("/api/v1/customers/verify-email")
      .send({
        email,
        otp,
      });

  if (verificationResponse.statusCode !== 200) {
    throw new Error(
      `Email verification failed: ${JSON.stringify(
        verificationResponse.body
      )}`
    );
  }

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

  return response.body.data.accessToken;
}

// ======================================
// Backward Compatibility
// ======================================

export async function createCustomerAndLogin() {
  return await customerLogin();
}