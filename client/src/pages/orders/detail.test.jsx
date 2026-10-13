
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { jsonResponse, mockFetch, renderApp } from "../../test/utils";

const order = (overrides = {}) => ({
    id: "7",
    customer_name: "Aasif Ali",
    delivery_address: "Bengaluru, Karnataka",
    phone: "9876543210",
    status: "PREPARING",
    total_amount: "547.00",
    created_at: "2026-10-13T12:23:09.331Z",
    updated_at: "2026-10-13T12:25:54.675Z",
    items: [
        { menu_item_id: 1, name: "Classic Burger", quantity: 2, unit_price: "149.00", subtotal: "298.00" },
        { menu_item_id: 2, name: "Margherita Pizza", quantity: 1, unit_price: "249.00", subtotal: "249.00" },
    ],
    ...overrides,
});

describe("Order tracking page", () => {
    it("shows a skeleton, then the order with its current status", async () => {
        let resolve;
        const fetchMock = mockFetch(() => new Promise((r) => { resolve = r; }));

        renderApp("/orders/7");
        expect(screen.getByLabelText("Loading order")).toBeInTheDocument();

        resolve(jsonResponse({ success: true, data: order() }));

        expect(await screen.findByRole("heading", { name: "Order #7" })).toBeInTheDocument();
        expect(fetchMock.mock.calls[0][0]).toBe("/api/orders/7");
        expect(screen.getByRole("heading", { name: "Being prepared" })).toBeInTheDocument();

        const current = screen.getByRole("listitem", { current: "step" });
        expect(current).toHaveTextContent("Preparing");

        expect(screen.getByText("Margherita Pizza")).toBeInTheDocument();
        expect(screen.getAllByText("₹547.00").length).toBeGreaterThan(0);
        expect(screen.getByText("Bengaluru, Karnataka")).toBeInTheDocument();
        expect(screen.getByText(/refreshes automatically/)).toBeInTheDocument();

        // Customers cannot change status from this page.
        expect(screen.queryByRole("button", { name: /cancel/i })).not.toBeInTheDocument();
    });

    it("treats cancelled orders as final", async () => {
        mockFetch(() => jsonResponse({ success: true, data: order({ status: "CANCELLED" }) }));

        renderApp("/orders/7");

        expect(await screen.findByRole("heading", { name: "Cancelled" })).toBeInTheDocument();
        expect(screen.queryByRole("listitem", { current: "step" })).not.toBeInTheDocument();
        expect(screen.getByText(/no further updates/)).toBeInTheDocument();
    });

    it("shows not found for unknown orders", async () => {
        mockFetch(() => jsonResponse({ success: false, message: "Order not found" }, 404));

        renderApp("/orders/999");

        expect(await screen.findByRole("heading", { name: "Order not found" })).toBeInTheDocument();
    });

    it("does not call the API for malformed ids", () => {
        const fetchMock = mockFetch(() => jsonResponse({}));

        renderApp("/orders/abc");

        expect(screen.getByRole("heading", { name: "Order not found" })).toBeInTheDocument();
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it("shows an error state with retry for server failures", async () => {
        let calls = 0;
        mockFetch(() => {
            calls += 1;
            return calls === 1
                ? jsonResponse({ success: false, message: "Internal server error" }, 500)
                : jsonResponse({ success: true, data: order({ status: "DELIVERED" }) });
        });

        renderApp("/orders/7");

        expect(await screen.findByText("We couldn't load this order")).toBeInTheDocument();
        await userEvent.click(screen.getByRole("button", { name: /try again/i }));

        expect(await screen.findByRole("heading", { name: "Delivered" })).toBeInTheDocument();
    });
});

describe("Not found page", () => {
    it("renders for unknown routes with a link home", () => {
        renderApp("/nope");

        expect(screen.getByRole("heading", { name: "This plate is empty" })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: /Return home/ })).toHaveAttribute("href", "/");
    });
});
