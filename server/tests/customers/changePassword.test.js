import request from "supertest";
import app from "../../src/app.js";

import { customerLogin } from "../helpers/customer.helper.js";

describe("Customer Change Password", () => {

    test("Change Password", async () => {

        const token = await customerLogin();

        const response = await request(app)
            .put("/api/v1/customers/change-password")
            .set("Authorization", `Bearer ${token}`)
            .send({

                oldPassword: "Password@123",

                newPassword: "Password@456"

            });

        console.log(response.body);

        expect(response.statusCode).toBe(200);

        expect(response.body.success).toBe(true);

    });

});