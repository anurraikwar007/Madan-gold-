import { describe, test, expect } from "@jest/globals";
import {
  generateToken,
  verifyToken,
} from "../../src/utils/jwt.js";

describe("Access Token", () => {
  test("must contain access token type", () => {
    const token = generateToken({
      id: "507f1f77bcf86cd799439011",
      role: "Customer",
    });

    const decoded = verifyToken(token);

    expect(decoded.type).toBe("access");
    expect(decoded.role).toBe("Customer");
  });
});