import request from "supertest";
import app from "../../src/app.js";

describe("Customer Login", () => {

    test("Login Customer", async () => {

        const unique = Date.now();

        const email = `jest${unique}@gmail.com`;

        const password = "Password@123";

        await request(app)
            .post("/api/v1/customers/register")
            .send({

                name: "Jest User",

                email,

                password,

                phone: `98765${unique.toString().slice(-5)}`

            });

        const response = await request(app)
            .post("/api/v1/customers/login")
            .send({

                email,

                password

            });

        console.log(response.body);

        expect(response.statusCode).toBe(200);

        expect(response.body.success).toBe(true);

        expect(response.body.data).toHaveProperty("accessToken");

    });

});
