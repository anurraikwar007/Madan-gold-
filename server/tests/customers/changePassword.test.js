import request from "supertest";

import app from "../../src/app.js";

describe("Change Password", () => {

    it("Without Token", async () => {

        const response = await request(app)

            .patch("/api/v1/customers/change-password")

            .send({

                oldPassword: "12345678",

                newPassword: "87654321"

            });

        expect([401,403]).toContain(response.statusCode);

    });

});