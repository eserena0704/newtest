import { describe, expect, it } from "vitest";

import {
  buildCartLineItems,
  getCartCount,
  getCartSavings,
  getCartSubtotal,
  normalizeCartItems,
} from "../lib/store";

describe("store cart helpers", () => {
  it("merges duplicate items and drops invalid quantities", () => {
    expect(
      normalizeCartItems([
        { productId: "signature-facial-edit", quantity: 1 },
        { productId: "signature-facial-edit", quantity: 2 },
        { productId: "unknown", quantity: 2 },
        { productId: "gift-voucher-100", quantity: 0 },
      ]),
    ).toEqual([{ productId: "signature-facial-edit", quantity: 3 }]);
  });

  it("calculates totals and savings from the current catalog", () => {
    const cart = [
      { productId: "signature-facial-edit", quantity: 2 },
      { productId: "gift-voucher-100", quantity: 1 },
    ];

    const lineItems = buildCartLineItems(cart);

    expect(lineItems).toHaveLength(2);
    expect(getCartCount(cart)).toBe(3);
    expect(getCartSubtotal(cart)).toBe(676);
    expect(getCartSavings(cart)).toBe(144);
  });
});
