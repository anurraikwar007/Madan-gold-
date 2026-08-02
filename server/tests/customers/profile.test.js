import request from "supertest";

import app from "../../src/app.js";

describe("Customer Profile", () => {

    it("Without Token", async () => {

        const response = await request(app)

            .get("/api/v1/customers/profile");

        expect([401,403]).toContain(response.statusCode);

    });

});