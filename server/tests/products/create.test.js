import request from "supertest";
import app from "../../src/app.js";

import { adminLogin } from "../helpers/auth.helper.js";

describe("Create Product", () => {

  test("Create Product", async () => {

    const token = await adminLogin();

    const unique = Date.now();

    const response = await request(app)
      .post("/api/v1/products")
      .set("Authorization", `Bearer ${token}`)
      .send({

       name: `Jest Silver Ring ${unique}`,

        shortDescription: "Premium 925 Silver",

        description: "925 Sterling Silver Ring",

        category: "Ring",

        metal: "Silver",

        purity: "925 Silver",

        gender: "Men",

        weight: unique % 1000,

        price: 50000,

        discountPrice: 45000,

        makingCharges: 1500,

        gst: 3,

        inventory: {
          stock: 20,
          reservedStock: 0,
          lowStockThreshold: 5
        },

        images: [
          {
            public_id: "abc",
            url: "https://dummyimage.com/600x600",
            alt: "Silver Ring",
            isPrimary: true
          }
        ]

      });

    expect(response.statusCode).toBe(201);

    expect(response.body.success).toBe(true);

  });

});