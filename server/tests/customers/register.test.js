import request from "supertest";
import app from "../../src/app.js";

describe("Customer Registration", () => {

    it("Register Customer Successfully", async () => {

        const response = await request(app)

            .post("/api/v1/customers/register")

            .send({

                firstName: "Test",

                lastName: "Customer",

                email: `customer${Date.now()}@mail.com`,

                password: "12345678",

                phone: "9876543210"

            });

        expect([200,201]).toContain(response.statusCode);

        expect(response.body.success).toBe(true);

    });

    it("Duplicate Email", async () => {

        const email = `duplicate${Date.now()}@mail.com`;

        await request(app)

            .post("/api/v1/customers/register")

            .send({

                firstName: "Test",

                lastName: "Customer",

                email,

                password: "12345678",

                phone: "9876543210"

            });

        const response = await request(app)

            .post("/api/v1/customers/register")

            .send({

                firstName: "Test",

                lastName: "Customer",

                email,

                password: "12345678",

                phone: "9876543210"

            });

        expect(response.statusCode).not.toBe(500);

    });

    it("Invalid Email", async () => {

        const response = await request(app)

            .post("/api/v1/customers/register")

            .send({

                firstName: "A",

                lastName: "B",

                email: "abc",

                password: "12345678",

                phone: "9876543210"

            });

        expect(response.statusCode).toBeGreaterThanOrEqual(400);

    });

});