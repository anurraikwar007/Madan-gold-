import {
  describe,
  test,
  expect,
} from "@jest/globals";

import {
  calculateGrandTotal,
  calculateShipping,
} from "../../src/utils/pricing.util.js";

describe("Pricing", () => {
  test("free shipping above threshold", () => {
    expect(
      calculateShipping(1000)
    ).toBe(0);
  });

  test("paid shipping below threshold", () => {
    expect(
      calculateShipping(999)
    ).toBe(100);
  });

  test("grand total calculation", () => {
    expect(
      calculateGrandTotal({
        subtotal: 1000,
        makingCharge: 100,
        gst: 198,
        shippingCharge: 0,
        discount: 100,
      })
    ).toBe(1198);
  });
});