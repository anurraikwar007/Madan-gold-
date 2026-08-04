import request from "supertest";

import app from "../../src/app.js";

import {
  createCustomerAndLogin,
} from "../helpers/customer.helper.js";

import {
  createProduct,
} from "../helpers/product.helper.js";

describe("Add Cart", () => {

  test("Add Product To Cart", async () => {

    const token =
      await createCustomerAndLogin();

    const product =
      await createProduct();

     const response =
     await request(app)
     .post(`/api/v1/cart/${product._id}`)
     .set(
      "Authorization",
      `Bearer ${token}`
     )
     .send({
      quantity: 2,
     });

     console.log(response.body);

     expect([200, 201]).toContain(
      response.statusCode
     );

     expect(response.body.success)
      .toBe(true);

  });

});