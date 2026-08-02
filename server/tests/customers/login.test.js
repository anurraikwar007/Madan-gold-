import request from "supertest";

import app from "../../src/app.js";

describe("Customer Login", () => {

    it("Wrong Email", async () => {

        const response = await request(app)

            .post("/api/v1/customers/login")

            .send({

                email: "wrong@mail.com",

                password: "12345678"

            });

        expect(response.statusCode).not.toBe(500);

    });

    it("Wrong Password", async () => {

        const response = await request(app)

            .post("/api/v1/customers/login")

            .send({

                email: "customer@mail.com",

                password: "wrong"

            });

        expect(response.statusCode).not.toBe(500);

    });

});