import request from "supertest";
import app from "../../src/app.js";

describe("Customer Email Verification", () => {
  const email = `verify_${Date.now()}@gmail.com`;

  const customer = {
    name: "Verification Test",
    email,
    password: "Test@123456",
    phone: `9${Date.now().toString().slice(-9)}`,
  };

  test("Register → OTP generated → Verify email → Login", async () => {
    // 1. REGISTER
    const registerResponse = await request(app)
      .post("/api/v1/customers/register")
      .send(customer);

    console.log("REGISTER:", registerResponse.statusCode);
    console.log("REGISTER BODY:", registerResponse.body);

    expect([200, 201]).toContain(registerResponse.statusCode);
    expect(registerResponse.body.success).toBe(true);

    // Registration should create an unverified customer
    expect(registerResponse.body.data.isVerified).toBe(false);

    // 2. GET OTP FROM TEST ENVIRONMENT
    const otp =
      global.__TEST_VERIFICATION_OTPS__?.[email];

    console.log("OTP:", otp);

    expect(otp).toBeDefined();
    expect(otp).toMatch(/^\d{6}$/);

    // 3. VERIFY EMAIL
    const verificationResponse = await request(app)
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
      "VERIFY BODY:",
      verificationResponse.body
    );

    expect([200, 201]).toContain(
      verificationResponse.statusCode
    );

    expect(
      verificationResponse.body.success
    ).toBe(true);

    expect(
      verificationResponse.body.data.isVerified
    ).toBe(true);

    // 4. LOGIN AFTER VERIFICATION
    const loginResponse = await request(app)
      .post("/api/v1/customers/login")
      .send({
        email,
        password: customer.password,
      });

    console.log(
      "LOGIN:",
      loginResponse.statusCode
    );

    console.log(
      "LOGIN BODY:",
      loginResponse.body
    );

    expect(loginResponse.statusCode).toBe(200);

    expect(loginResponse.body.success).toBe(true);

    expect(
      loginResponse.body.data.accessToken
    ).toBeDefined();

    // Cleanup test OTP
    delete global.__TEST_VERIFICATION_OTPS__[email];
  });
});