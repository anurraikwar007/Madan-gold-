import request from "supertest";
import app from "../../src/app.js";

import { customerLogin } from "../helpers/customer.helper.js";

describe("Customer Profile", () => {

    test("Get Profile", async () => {

        const token = await customerLogin();

        const response = await request(app)
            .get("/api/v1/customers/profile")
            .set("Authorization", `Bearer ${token}`);

        console.log(response.body);

        expect(response.statusCode).toBe(200);

        expect(response.body.success).toBe(true);

    });

});