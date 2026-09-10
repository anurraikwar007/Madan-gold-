import request from "supertest";
import app from "../../src/app.js";

import { adminLogin } from "./auth.helper.js";

export async function createProduct(token = null) {
  if (!token) {
    token = await adminLogin();
  }

  const unique = Date.now();

  const response = await request(app)
    .post("/api/v1/products")
    .set("Authorization", `Bearer ${token}`)
    .send({
      name: `Test Silver Ring ${unique}`,
      shortDescription: "Premium 925 Silver Jewellery",
      description: "Premium 925 Sterling Silver Ring",
      category: "Ring",

      metal: "Silver",
      purity: "925 Silver",

      gender: "Men",
      weight: Math.max((unique % 1000) / 10, 1),

      price: 5000,
      discountPrice: 4500,
      makingCharges: 500,
      gst: 3,

      inventory: {
        stock: 20,
        reservedStock: 0,
        lowStockThreshold: 5,
      },

      images: [
        {
          public_id: `test-product-${unique}`,
          url: "https://dummyimage.com/600x600",
          alt: "925 Silver Ring",
          isPrimary: true,
        },
      ],
    });

  if (response.statusCode !== 201) {
    throw new Error(
      `Product creation failed: ${response.statusCode} ${JSON.stringify(
        response.body
      )}`
    );
  }

  return response.body.data;
}