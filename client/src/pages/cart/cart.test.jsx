
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { cartLine, renderApp } from "../../test/utils";

const items = [
    cartLine(),
    cartLine({ id: 3, name: "French Fries", pricePaise: 9900, quantity: 2 }),
];

describe("Cart page", () => {
    it("shows an empty state when there is nothing in the cart", () => {
        renderApp("/cart");

        expect(screen.getByRole("heading", { name: "Your cart is empty" })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Browse the menu" })).toBeInTheDocument();
    });

    it("lists items with line totals and a derived subtotal", () => {
        renderApp("/cart", { cartItems: items });

        expect(screen.getByRole("heading", { name: "Classic Burger" })).toBeInTheDocument();
        expect(screen.getByText("₹198.00")).toBeInTheDocument(); // 2 × 99
        const summary = screen.getByRole("region", { name: "Order summary" });
        expect(within(summary).getByText("Subtotal (3 items)")).toBeInTheDocument();
        expect(within(summary).getAllByText("₹347.00")).toHaveLength(2); // subtotal + total
    });

    it("updates quantities and removes items", async () => {
        const user = userEvent.setup();
        const { store } = renderApp("/cart", { cartItems: items });

        await user.click(screen.getByRole("button", { name: "Increase quantity of Classic Burger" }));
        expect(store.getState().cart.items[0].quantity).toBe(2);

        await user.click(screen.getByRole("button", { name: "Decrease quantity of French Fries" }));
        expect(store.getState().cart.items[1].quantity).toBe(1);

        await user.click(screen.getAllByRole("button", { name: "Remove Classic Burger from cart" })[0]);
        expect(screen.queryByRole("heading", { name: "Classic Burger" })).not.toBeInTheDocument();
        expect(store.getState().cart.items.map((item) => item.id)).toEqual([3]);
    });

    it("asks for confirmation before clearing the cart", async () => {
        const user = userEvent.setup();
        const { store } = renderApp("/cart", { cartItems: items });

        await user.click(screen.getByRole("button", { name: "Clear cart" }));
        await user.click(screen.getByRole("button", { name: "Cancel" }));
        expect(store.getState().cart.items).toHaveLength(2);

        await user.click(screen.getByRole("button", { name: "Clear cart" }));
        await user.click(screen.getByRole("button", { name: "Yes, clear" }));

        expect(store.getState().cart.items).toEqual([]);
        expect(screen.getByRole("heading", { name: "Your cart is empty" })).toBeInTheDocument();
    });
});
