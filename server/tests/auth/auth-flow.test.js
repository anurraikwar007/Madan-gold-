import request from "supertest";
import app from "../../src/app.js";

describe("Authentication Flow", () => {
  let customerAgent;
  let adminAgent;

  let customerAccessToken;
  let adminAccessToken;

  // ==========================================
  // CUSTOMER LOGIN
  // ==========================================

  test("1. Customer login", async () => {
    customerAgent = request.agent(app);

    const unique = Date.now();

    const email =
      `authflow${unique}@gmail.com`;

    const password = "Password@123";

    const phone =
      `98765${unique.toString().slice(-5)}`;

    const registerResponse =
      await customerAgent
        .post("/api/v1/customers/register")
        .send({
          name: "Auth Flow Customer",
          email,
          password,
          phone,
        });

    expect([200, 201]).toContain(
      registerResponse.statusCode
    );

    const otp =
      global.__TEST_VERIFICATION_OTPS__?.[email];

    expect(otp).toBeDefined();

    const verifyResponse =
      await customerAgent
        .post("/api/v1/customers/verify-email")
        .send({
          email,
          otp,
        });

    expect(
      verifyResponse.statusCode
    ).toBe(200);

    delete global.__TEST_VERIFICATION_OTPS__[email];

    const loginResponse =
      await customerAgent
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

    customerAccessToken =
      loginResponse.body.data.accessToken;

    const cookies =
      loginResponse.headers["set-cookie"];

    expect(cookies).toBeDefined();

    expect(cookies).toBeDefined();
    expect(cookies.length).toBeGreaterThan(0);
  });

  // ==========================================
  // CUSTOMER REFRESH
  // ==========================================

  test("2. Customer refresh", async () => {
    const response =
      await customerAgent
        .post("/api/v1/auth/refresh-token");

    expect(
      response.statusCode
    ).toBe(200);

    expect(
      response.body.success
    ).toBe(true);

    expect(
      response.body.data
    ).toHaveProperty("accessToken");

    customerAccessToken =
      response.body.data.accessToken;
  });

  // ==========================================
  // CUSTOMER LOGOUT
  // ==========================================

  test("3. Customer logout", async () => {
    const response =
      await customerAgent
        .post("/api/v1/customers/logout")
        .set(
          "Authorization",
          `Bearer ${customerAccessToken}`
        );

    expect(
      response.statusCode
    ).toBe(200);

    expect(
      response.body.success
    ).toBe(true);
  });

  // ==========================================
  // CUSTOMER REFRESH AFTER LOGOUT
  // ==========================================

  test("3A. Customer refresh must fail after logout", async () => {
    const response =
      await customerAgent
        .post("/api/v1/auth/refresh-token");

    expect(
      response.statusCode
    ).toBe(401);
  });

  // ==========================================
  // ADMIN LOGIN
  // ==========================================

  test("4. Admin login", async () => {
    adminAgent = request.agent(app);

    const response =
      await adminAgent
        .post("/api/v1/admin/login")
        .send({
          email:
            process.env.ADMIN_EMAIL ||
            "admin@madangold.com",

          password:
            process.env.ADMIN_PASSWORD ||
            "12345678",
        });

    expect(
      response.statusCode
    ).toBe(200);

    expect(
      response.body.success
    ).toBe(true);

    expect(
      response.body.data
    ).toHaveProperty("accessToken");

    adminAccessToken =
      response.body.data.accessToken;

    const cookies =
      response.headers["set-cookie"];

    expect(cookies).toBeDefined();

    expect(cookies).toBeDefined();
    expect(cookies.length).toBeGreaterThan(0);
  });

  // ==========================================
  // ADMIN REFRESH
  // ==========================================

  test("5. Admin refresh", async () => {
    const response =
      await adminAgent
        .post("/api/v1/auth/refresh-token");

    expect(
      response.statusCode
    ).toBe(200);

    expect(
      response.body.success
    ).toBe(true);

    expect(
      response.body.data
    ).toHaveProperty("accessToken");

    adminAccessToken =
      response.body.data.accessToken;
  });

  // ==========================================
  // ADMIN LOGOUT
  // ==========================================

  test("6. Admin logout", async () => {
    const response =
      await adminAgent
        .post("/api/v1/admin/logout")
        .set(
          "Authorization",
          `Bearer ${adminAccessToken}`
        );

    expect(
      response.statusCode
    ).toBe(200);

    expect(
      response.body.success
    ).toBe(true);
  });

  // ==========================================
  // ADMIN REFRESH AFTER LOGOUT
  // ==========================================

  test("6A. Admin refresh must fail after logout", async () => {
    const response =
      await adminAgent
        .post("/api/v1/auth/refresh-token");

    expect(
      response.statusCode
    ).toBe(401);
  });
});