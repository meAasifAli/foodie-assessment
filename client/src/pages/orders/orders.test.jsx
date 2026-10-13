
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { jsonResponse, mockFetch, renderApp } from "../../test/utils";

// GET /api/orders returns rows without items.
const row = (id, overrides = {}) => ({
    id,
    customer_name: "Aasif Ali",
    delivery_address: "Bengaluru, Karnataka",
    phone: "9876543210",
    status: "RECEIVED",
    total_amount: "298.00",
    created_at: "2026-10-13T12:00:00.000Z",
    updated_at: "2026-10-13T12:00:00.000Z",
    ...overrides,
});

describe("Orders page", () => {
    it("is reachable from the navbar", async () => {
        const user = userEvent.setup();
        mockFetch(() => jsonResponse({ success: true, count: 0, data: [] }));
        const { getLocation } = renderApp("/cart");

        const nav = screen.getByRole("navigation", { name: "Main" });
        await user.click(within(nav).getByRole("link", { name: "Orders" }));

        expect(getLocation().pathname).toBe("/orders");
        expect(within(nav).getByRole("link", { name: "Orders" })).toHaveAttribute("aria-current", "page");
    });

    it("lists every order from the database in API order", async () => {
        const fetchMock = mockFetch(() =>
            jsonResponse({
                success: true,
                count: 2,
                data: [row("2"), row("1", { status: "PREPARING", total_amount: "547.00", customer_name: "Priya" })],
            })
        );

        renderApp("/orders");

        const links = await screen.findAllByRole("link", { name: /Order #\d+, view details/ });
        expect(fetchMock.mock.calls[0][0]).toBe("/api/orders");
        expect(links.map((link) => link.getAttribute("href"))).toEqual(["/orders/2", "/orders/1"]);
        expect(within(links[1]).getByText("Being prepared")).toBeInTheDocument();
        expect(within(links[1]).getByText("₹547.00")).toBeInTheDocument();
        expect(within(links[1]).getByText(/Priya/)).toBeInTheDocument();
        expect(screen.getByText("2 orders, newest first")).toBeInTheDocument();
    });

    it("shows an empty state when there are no orders", async () => {
        mockFetch(() => jsonResponse({ success: true, count: 0, data: [] }));

        renderApp("/orders");

        expect(await screen.findByRole("heading", { name: "No orders yet" })).toBeInTheDocument();
    });

    it("shows an error with retry", async () => {
        let calls = 0;
        mockFetch(() => {
            calls += 1;
            return calls === 1
                ? jsonResponse({ success: false, message: "Internal server error" }, 500)
                : jsonResponse({ success: true, data: [row("3")] });
        });

        renderApp("/orders");

        expect(await screen.findByText("We couldn't load orders")).toBeInTheDocument();
        await userEvent.click(screen.getByRole("button", { name: /try again/i }));
        expect(await screen.findByRole("link", { name: "Order #3, view details" })).toBeInTheDocument();
    });

    it("tracks an order by number", async () => {
        const user = userEvent.setup();
        mockFetch((url) =>
            url === "/api/orders"
                ? jsonResponse({ success: true, data: [] })
                : jsonResponse({ success: true, data: { ...row("12"), items: [] } })
        );
        const { getLocation } = renderApp("/orders");

        await user.type(screen.getByLabelText("Order number"), "abc");
        await user.click(screen.getByRole("button", { name: "Track order" }));
        expect(screen.getByText(/Enter a valid order number/)).toBeInTheDocument();

        await user.clear(screen.getByLabelText("Order number"));
        await user.type(screen.getByLabelText("Order number"), "#12");
        await user.click(screen.getByRole("button", { name: "Track order" }));

        expect(getLocation().pathname).toBe("/orders/12");
        expect(await screen.findByRole("heading", { name: "Order #12" })).toBeInTheDocument();
    });
});
