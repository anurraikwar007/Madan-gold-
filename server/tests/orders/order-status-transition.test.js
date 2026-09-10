import {
  describe,
  test,
  expect,
} from "@jest/globals";

import ORDER_STATUS from
  "../../src/constants/orderStatus.js";

describe("Order status transitions", () => {
  test("Pending can move to Confirmed", () => {
    expect(
      ORDER_STATUS.Pending
    ).toContain("Confirmed");
  });

  test("Confirmed can move to Processing", () => {
    expect(
      ORDER_STATUS.Confirmed
    ).toContain("Processing");
  });

  test("Processing can move to Packed", () => {
    expect(
      ORDER_STATUS.Processing
    ).toContain("Packed");
  });

  test("Packed can move to Shipped", () => {
    expect(
      ORDER_STATUS.Packed
    ).toContain("Shipped");
  });

  test("Delivered cannot move anywhere", () => {
    expect(
      ORDER_STATUS.Delivered
    ).toEqual([]);
  });
});