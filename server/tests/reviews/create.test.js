import request from "supertest";
import app from "../../src/app.js";

import { customerLogin } from "../helpers/customer.helper.js";

describe("Create Review", () => {

  test("Create Product Review", async () => {

    const token = await customerLogin();

    const products = await request(app)
      .get("/api/v1/products");

    expect(products.statusCode).toBe(200);

    expect(products.body.data.products.length).toBeGreaterThan(0);

   const productId = products.body.data.products[0]._id;

    const response = await request(app)
      .post("/api/v1/reviews")
      .set("Authorization", `Bearer ${token}`)
      .send({
        product: productId,
        rating: 5,
        comment: "Excellent Product"
      });

    console.log(response.body);

    expect([200, 201]).toContain(response.statusCode);

    expect(response.body.success).toBe(true);

  });

});