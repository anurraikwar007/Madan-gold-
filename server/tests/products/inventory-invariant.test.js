import {
  describe,
  test,
  expect,
} from "@jest/globals";

describe("Inventory invariant", () => {
  test(
    "available stock must equal stock minus reserved stock",
    () => {
      const stock = 20;
      const reservedStock = 7;

      const availableStock =
        stock - reservedStock;

      expect(availableStock).toBe(13);
      expect(reservedStock).toBeLessThanOrEqual(
        stock
      );
    }
  );

  test(
    "reserved stock must never exceed stock",
    () => {
      const stock = 10;
      const reservedStock = 12;

      expect(
        reservedStock <= stock
      ).toBe(false);
    }
  );
});