
import { describe, expect, it } from "vitest";
import reducer, {
    addToCart,
    clearCart,
    decrementQuantity,
    incrementQuantity,
    MAX_QUANTITY,
    removeFromCart,
    selectCartCount,
    selectCartSubtotalPaise,
} from "./cartSlice";

const burger = { id: 1, name: "Burger", pricePaise: 14900, imageUrl: "", isAvailable: true, description: "x" };
const fries = { id: 3, name: "Fries", pricePaise: 9950, imageUrl: "", isAvailable: true };

const run = (...actions) => actions.reduce(reducer, undefined);

describe("cartSlice", () => {
    it("adds a new product with quantity 1 and only stores what the cart needs", () => {
        const state = run(addToCart(burger));

        expect(state.items).toEqual([
            { id: 1, name: "Burger", pricePaise: 14900, imageUrl: "", quantity: 1 },
        ]);
    });

    it("increments quantity when the same product is added again", () => {
        const state = run(addToCart(burger), addToCart(burger));

        expect(state.items).toHaveLength(1);
        expect(state.items[0].quantity).toBe(2);
    });

    it("keeps different products as separate lines", () => {
        const state = run(addToCart(burger), addToCart(fries));

        expect(state.items.map((item) => item.id)).toEqual([1, 3]);
    });

    it("refuses unavailable or malformed products", () => {
        const state = run(
            addToCart({ ...burger, isAvailable: false }),
            addToCart({ ...burger, id: "1" }),
            addToCart({ ...burger, pricePaise: 149.5 }),
            addToCart(null)
        );

        expect(state.items).toEqual([]);
    });

    it("increments and decrements, removing the line at zero", () => {
        let state = run(addToCart(burger), incrementQuantity(1), incrementQuantity(1));
        expect(state.items[0].quantity).toBe(3);

        state = reducer(state, decrementQuantity(1));
        expect(state.items[0].quantity).toBe(2);

        state = reducer(reducer(state, decrementQuantity(1)), decrementQuantity(1));
        expect(state.items).toEqual([]);
    });

    it("caps quantity at the backend limit", () => {
        let state = run(addToCart(burger));
        for (let i = 0; i < MAX_QUANTITY + 5; i += 1) state = reducer(state, incrementQuantity(1));

        expect(state.items[0].quantity).toBe(MAX_QUANTITY);
    });

    it("ignores actions for unknown ids", () => {
        const state = run(addToCart(burger), incrementQuantity(99), decrementQuantity(99), removeFromCart(99));

        expect(state.items).toHaveLength(1);
        expect(state.items[0].quantity).toBe(1);
    });

    it("removes a product and clears the cart", () => {
        let state = run(addToCart(burger), addToCart(fries), removeFromCart(1));
        expect(state.items.map((item) => item.id)).toEqual([3]);

        state = reducer(state, clearCart());
        expect(state.items).toEqual([]);
    });

    it("derives item count and subtotal in integer paise", () => {
        const cart = run(addToCart(burger), addToCart(burger), addToCart(fries));
        const root = { cart };

        expect(selectCartCount(root)).toBe(3);
        expect(selectCartSubtotalPaise(root)).toBe(14900 * 2 + 9950);
    });
});
