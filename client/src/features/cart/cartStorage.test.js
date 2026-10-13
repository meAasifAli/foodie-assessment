
import { describe, expect, it } from "vitest";
import { loadCartState, saveCartState } from "./cartStorage";

const KEY = "foodie.cart.v1";
const line = { id: 1, name: "Burger", pricePaise: 14900, imageUrl: "", quantity: 2 };

describe("cartStorage", () => {
    it("round-trips a valid cart", () => {
        saveCartState({ items: [line] });

        expect(loadCartState()).toEqual({ items: [line] });
    });

    it("returns undefined for missing or corrupt data", () => {
        expect(loadCartState()).toBeUndefined();

        window.localStorage.setItem(KEY, "{not json");
        expect(loadCartState()).toBeUndefined();

        window.localStorage.setItem(KEY, JSON.stringify({ items: "nope" }));
        expect(loadCartState()).toBeUndefined();
    });

    it("drops invalid and duplicate lines", () => {
        window.localStorage.setItem(
            KEY,
            JSON.stringify({
                items: [
                    line,
                    { ...line, quantity: 5 },
                    { ...line, id: 2, quantity: -1 },
                    { ...line, id: 3, pricePaise: "free" },
                    { id: 4 },
                ],
            })
        );

        expect(loadCartState()).toEqual({ items: [line] });
    });
});
