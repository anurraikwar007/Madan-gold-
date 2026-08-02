import request from "supertest";
import app from "../../src/app.js";
import { adminLogin } from "../helpers/auth.helper.js";

describe("Create Category", () => {

    test("Create Category", async () => {

        const token = await adminLogin();

        const response = await request(app)

            .post("/api/v1/categories")

            .set("Authorization", `Bearer ${token}`)

            .send({

                name: "Test Category"

            });

        expect(response.statusCode).toBe(201);

        expect(response.body.success).toBe(true);

    });

});