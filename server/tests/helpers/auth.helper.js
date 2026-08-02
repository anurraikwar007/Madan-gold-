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

    return response.body.data.token;
}

export async function customerLogin(email, password) {

    const response = await request(app)
        .post("/api/v1/customers/login")
        .send({
            email,
            password
        });

    expect(response.statusCode).toBe(200);

    return response.body.data.token;
}