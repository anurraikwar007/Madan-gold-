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

        name: `Jest Gold Ring ${unique}`,

        shortDescription: "Premium",

        description: "22K Gold Ring",

        category: "Ring",

        metal: "Gold",

        purity: "22K",

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
            alt: "Gold Ring",
            isPrimary: true
          }
        ]

      });

    expect(response.statusCode).toBe(201);

    expect(response.body.success).toBe(true);

  });

});