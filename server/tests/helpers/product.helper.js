import request from "supertest";
import app from "../../src/app.js";

import { adminLogin } from "./auth.helper.js";

export async function createProduct(token = null) {

  // Agar token pass nahi hua to automatically admin login kar lo
  if (!token) {
    token = await adminLogin();
  }

  const unique = Date.now();

  const response = await request(app)
    .post("/api/v1/products")
    .set("Authorization", `Bearer ${token}`)
    .send({
      name: `Test Product ${unique}`,
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
        availableStock: 20,
        reservedStock: 0,
        lowStockThreshold: 5,
      },
      images: [
        {
          public_id: "abc",
          url: "https://dummyimage.com/600x600",
          alt: "Gold Ring",
          isPrimary: true,
        },
      ],
    });

  expect(response.statusCode).toBe(201);

  console.log("PRODUCT RESPONSE:", response.statusCode, response.body);

  return response.body.data;
}