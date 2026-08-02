import request from "supertest";

import app from "../../src/app.js";

export async function createOrder(token, productId) {

    const response = await request(app)

        .post("/api/v1/orders")

        .set("Authorization", `Bearer ${token}`)

        .send({

            products: [

                {

                    product: productId,

                    quantity: 1

                }

            ],

            paymentMethod: "COD"

        });

    expect(response.statusCode).toBe(201);

    return response.body.data;

}