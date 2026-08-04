import request from "supertest";
import app from "../../src/app.js";

import { adminLogin } from "../helpers/auth.helper.js";
import { createCategory } from "../helpers/category.helper.js";

describe("Restore Category", () => {

  test("Restore Deleted Category", async () => {

    const token = await adminLogin();

    const category = await createCategory(token);

    const deleteResponse = await request(app)
    .delete(`/api/v1/categories/${category._id}`)
    .set("Authorization", `Bearer ${token}`);

    console.log("DELETE:", deleteResponse.statusCode);
    console.log(deleteResponse.body);

    const response = await request(app)
  .patch(`/api/v1/categories/${category._id}/restore`)
  .set("Authorization", `Bearer ${token}`);

    console.log("RESTORE:", response.statusCode);
    console.log(response.body);
    expect(response.statusCode).toBe(200);

    expect(response.body.success).toBe(true);

  });

});