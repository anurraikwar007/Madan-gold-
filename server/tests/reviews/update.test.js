import request from "supertest";
import app from "../../src/app.js";

import { customerLogin } from "../helpers/customer.helper.js";

describe("Update Review", () => {

  test("Update Customer Review", async () => {

    const token = await customerLogin();

    const myReviews = await request(app)
      .get("/api/v1/reviews/my")
      .set("Authorization", `Bearer ${token}`);

    if (!myReviews.body.data?.length) return;

    const reviewId = myReviews.body.data[0]._id;

    const response = await request(app)
      .put(`/api/v1/reviews/${reviewId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        rating: 4,
        comment: "Updated Review"
      });

    console.log(response.body);

    expect(response.statusCode).toBe(200);

    expect(response.body.success).toBe(true);

  });

});