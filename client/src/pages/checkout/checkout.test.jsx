
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { cartLine, jsonResponse, mockFetch, renderApp } from "../../test/utils";

const items = [cartLine({ quantity: 2 }), cartLine({ id: 3, name: "French Fries", pricePaise: 9900 })];

const createdOrder = {
    id: "42",
    customer_name: "Aasif Ali",
    delivery_address: "Bengaluru, Karnataka",
    phone: "9876543210",
    status: "RECEIVED",
    total_amount: "397.00",
    created_at: "2026-10-13T12:00:00.000Z",
    items: [
        { menuItemId: 1, name: "Classic Burger", quantity: 2, unitPrice: "149.00", subtotal: "298.00" },
        { menuItemId: 3, name: "French Fries", quantity: 1, unitPrice: "99.00", subtotal: "99.00" },
    ],
};

async function fillForm(user) {
    await user.type(screen.getByLabelText(/Full name/), "Aasif Ali");
    await user.type(screen.getByLabelText(/Phone number/), "9876543210");
    await user.type(screen.getByLabelText(/Delivery address/), "Bengaluru, Karnataka");
}

describe("Checkout page", () => {
    it("blocks checkout when the cart is empty", () => {
        renderApp("/checkout");

        expect(screen.getByRole("heading", { name: "Nothing to check out yet" })).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "Place order" })).not.toBeInTheDocument();
    });

    it("shows inline validation errors and does not submit invalid details", async () => {
        const fetchMock = mockFetch(() => jsonResponse({ success: true, data: createdOrder }, 201));
        const user = userEvent.setup();
        renderApp("/checkout", { cartItems: items });

        await user.click(screen.getByRole("button", { name: "Place order" }));

        expect(screen.getByText("Please enter your name.")).toBeInTheDocument();
        expect(screen.getByText("Please enter a phone number.")).toBeInTheDocument();
        expect(screen.getByText("Please enter a delivery address.")).toBeInTheDocument();
        expect(screen.getByLabelText(/Full name/)).toHaveFocus();
        expect(screen.getByLabelText(/Full name/)).toHaveAttribute("aria-invalid", "true");

        await user.type(screen.getByLabelText(/Phone number/), "12345");
        expect(screen.getByText(/Enter a valid phone number/)).toBeInTheDocument();

        expect(fetchMock).not.toHaveBeenCalled();
    });

    it("submits only ids and quantities, clears the cart and opens the order page", async () => {
        const fetchMock = mockFetch((url, init) => {
            if (init.method === "POST") return jsonResponse({ success: true, data: createdOrder }, 201);
            return jsonResponse({ success: true, data: { ...createdOrder, items: [] } });
        });
        const user = userEvent.setup();
        const { store, getLocation } = renderApp("/checkout", { cartItems: items });

        await fillForm(user);
        await user.click(screen.getByRole("button", { name: "Place order" }));

        await waitFor(() => expect(getLocation().pathname).toBe("/orders/42"));

        const [url, init] = fetchMock.mock.calls[0];
        expect(url).toBe("/api/orders");
        expect(init.method).toBe("POST");
        expect(JSON.parse(init.body)).toEqual({
            customerName: "Aasif Ali",
            deliveryAddress: "Bengaluru, Karnataka",
            phone: "9876543210",
            items: [
                { menuItemId: 1, quantity: 2 },
                { menuItemId: 3, quantity: 1 },
            ],
        });
        expect(store.getState().cart.items).toEqual([]);
        expect(await screen.findByText("Order placed successfully!")).toBeInTheDocument();
    });

    it("keeps the cart and shows the server error when the order fails", async () => {
        mockFetch(() => jsonResponse({ success: false, message: "One or more menu items are unavailable" }, 409));
        const user = userEvent.setup();
        const { store, getLocation } = renderApp("/checkout", { cartItems: items });

        await fillForm(user);
        await user.click(screen.getByRole("button", { name: "Place order" }));

        expect(await screen.findByText("We couldn't place your order")).toBeInTheDocument();
        expect(screen.getByText(/One or more menu items are unavailable/)).toBeInTheDocument();
        expect(store.getState().cart.items).toHaveLength(2);
        expect(getLocation().pathname).toBe("/checkout");
    });

    it("prevents duplicate submissions while the order is in flight", async () => {
        let resolve;
        const fetchMock = mockFetch(() => new Promise((r) => { resolve = r; }));
        const user = userEvent.setup();
        renderApp("/checkout", { cartItems: items });

        await fillForm(user);
        const submit = screen.getByRole("button", { name: "Place order" });
        await user.click(submit);

        const busy = screen.getByRole("button", { name: /Placing order/ });
        expect(busy).toBeDisabled();
        await user.click(busy);

        expect(fetchMock).toHaveBeenCalledTimes(1);
        resolve(jsonResponse({ success: false, message: "Customer name is required" }, 400));
        expect(await screen.findByText("Customer name is required")).toBeInTheDocument();
    });
});
