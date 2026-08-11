import request from "supertest";
import app from "../../src/app.js";

describe("Customer Email Verification", () => {
  test("Customer signup should require email verification", async () => {
    const unique = Date.now();

    const email =
      `verify${unique}@gmail.com`;

    const password = "Test@12345";

    const phone =
      `98765${unique.toString().slice(-5)}`;

    // ======================================
    // Register
    // ======================================

    const registerResponse =
      await request(app)
        .post("/api/v1/customers/register")
        .send({
          name: "Verification Test",
          email,
          phone,
          password,
        });

    console.log(
      "REGISTER:",
      registerResponse.statusCode
    );

    expect([200, 201]).toContain(
      registerResponse.statusCode
    );

    expect(
      registerResponse.body.success
    ).toBe(true);

    // ======================================
    // Account should initially be unverified
    // ======================================

    expect(
      registerResponse.body.data.isVerified
    ).toBe(false);

    // ======================================
    // OTP should exist in test environment
    // ======================================

    const otp =
      global.__TEST_VERIFICATION_OTPS__?.[email];

    expect(otp).toBeDefined();
    expect(otp).toMatch(/^\d{6}$/);

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

    console.log(
      "VERIFY:",
      verificationResponse.statusCode
    );

    console.log(
      verificationResponse.body
    );

    expect(
      verificationResponse.statusCode
    ).toBe(200);

    expect(
      verificationResponse.body.success
    ).toBe(true);

    expect(
      verificationResponse.body.data.isVerified
    ).toBe(true);

    delete global.__TEST_VERIFICATION_OTPS__[email];

    // ======================================
    // Verified customer should be able to login
    // ======================================

    const loginResponse =
      await request(app)
        .post("/api/v1/customers/login")
        .send({
          email,
          password,
        });

    expect(
      loginResponse.statusCode
    ).toBe(200);

    expect(
      loginResponse.body.success
    ).toBe(true);

    expect(
      loginResponse.body.data
    ).toHaveProperty("accessToken");
  });
});
