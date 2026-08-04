import request from "supertest";
import app from "../../src/app.js";

export async function addToCart(
  token,
  productId,
  quantity = 1
) {
  const response = await request(app)
    .post(`/api/v1/cart/${productId}`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      quantity,
    });

  console.log(response.body);

  expect(response.statusCode).toBe(200);

  return response.body.data;
}