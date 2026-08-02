import request from "supertest";
import app from "../../src/app.js";

export async function createCustomer(data = {}) {

    const payload = {

        firstName: "Test",

        lastName: "Customer",

        email: `customer${Date.now()}@mail.com`,

        password: "12345678",

        phone: "9876543210",

        ...data

    };

    const response = await request(app)

        .post("/api/v1/customers/register")

        .send(payload);

    return {

        response,

        payload

    };

}