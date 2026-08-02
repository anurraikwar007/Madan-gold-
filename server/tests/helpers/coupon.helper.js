import request from "supertest";

import app from "../../src/app.js";

export async function createCoupon(token) {

    const response = await request(app)

        .post("/api/v1/coupons")

        .set("Authorization", `Bearer ${token}`)

        .send({

            code: `TEST${Date.now()}`,

            discountType: "percentage",

            discountValue: 10,

            expiryDate: "2030-01-01"

        });

    expect(response.statusCode).toBe(201);

    return response.body.data;

}