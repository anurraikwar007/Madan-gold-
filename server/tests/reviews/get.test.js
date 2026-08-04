import request from "supertest";
import app from "../../src/app.js";

describe("Get Reviews", () => {

  test("Get Product Reviews", async () => {

    const products = await request(app)
      .get("/api/v1/products");

    expect(products.statusCode).toBe(200);

    const productId = products.body.data.products[0]._id;

    const response = await request(app)
      .get(`/api/v1/reviews/product/${productId}`);

    console.log(response.body);

    expect(response.statusCode).toBe(200);

    expect(response.body.success).toBe(true);

  });

});