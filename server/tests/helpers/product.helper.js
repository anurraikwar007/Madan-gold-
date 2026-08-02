import request from "supertest";

import app from "../../src/app.js";

export async function createProduct(token, categoryId) {

    const response = await request(app)

        .post("/api/v1/products")

        .set("Authorization", `Bearer ${token}`)

        .send({

            name: `Product ${Date.now()}`,

            category: categoryId,

            metal: "Gold",

            purity: "22K",

            weight: 10,

            makingCharge: 100,

            price: 50000

        });

    expect(response.statusCode).toBe(201);

    return response.body.data;

}