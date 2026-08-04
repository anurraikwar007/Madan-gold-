import request from "supertest";
import app from "../../src/app.js";

export async function createCategory(token) {

  const unique = Date.now();

  const response = await request(app)
    .post("/api/v1/categories")
    .set("Authorization", `Bearer ${token}`)
    .send({
      name: `Category ${unique}`,
      description: "Test Category"
    });

  expect(response.statusCode).toBe(201);

  return response.body.data;
}