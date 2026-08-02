import request from "supertest";
import app from "../../src/app.js";

describe("Get Products", () => {

    test("Get All Products", async () => {

        const response = await request(app)

            .get("/api/v1/products");

        expect(response.statusCode).toBe(200);

    });

});