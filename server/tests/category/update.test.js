import request from "supertest";
import app from "../../src/app.js";

import { adminLogin } from "../helpers/auth.helper.js";
import { createProduct } from "../helpers/product.helper.js";

describe("Update Product", () => {

  test("Update Product", async () => {

    const token = await adminLogin();

    const product = await createProduct(token);

    const unique = Date.now();

    const response = await request(app)
      .put(`/api/v1/products/${product._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({

        name: `Updated Product ${unique}`,

        shortDescription: "Updated",

        description: "Updated Description",

        category: "Ring",

        metal: "Gold",

        purity: "22K",

        gender: "Men",

        weight: 200,

        price: 70000,

        discountPrice: 65000,

        makingCharges: 2500,

        gst: 3

      });

    expect(response.statusCode).toBe(200);

    expect(response.body.success).toBe(true);

  });

});