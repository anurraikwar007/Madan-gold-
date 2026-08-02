import request from "supertest";
import app from "../../src/app.js";

describe("Get Categories", () => {

    test("Get All Categories", async () => {

        const response = await request(app)

            .get("/api/v1/categories");

        expect(response.statusCode).toBe(200);

        expect(response.body.success).toBe(true);

    });

});