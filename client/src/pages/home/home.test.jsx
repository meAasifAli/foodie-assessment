
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { jsonResponse, MENU, mockFetch, renderApp } from "../../test/utils";

/** Mimics GET /api/menu: filters by search, then pages with ?page & ?limit. */
function menuServer(allItems) {
    return (url) => {
        const params = new URL(url, "http://localhost").searchParams;
        const page = Number(params.get("page") ?? 1);
        const limit = Number(params.get("limit") ?? 10);
        const search = (params.get("search") ?? "").toLowerCase();

        const matched = allItems.filter(
            (item) =>
                !search ||
                item.name.toLowerCase().includes(search) ||
                item.description.toLowerCase().includes(search)
        );
        const data = matched.slice((page - 1) * limit, page * limit);
        const totalPages = Math.ceil(matched.length / limit);

        return jsonResponse({
            success: true,
            count: data.length,
            data,
            pagination: { page, limit, totalItems: matched.length, totalPages, hasNextPage: page < totalPages, hasPrevPage: page > 1 },
        });
    };
}

const manyItems = Array.from({ length: 23 }, (_, index) => ({
    id: index + 1,
    name: `Dish ${index + 1}`,
    description: index % 2 ? "Spicy and smoky" : "Mild and creamy",
    price: "100.00",
    image_url: "",
    is_available: true,
}));

const requestedParams = (fetchMock) =>
    fetchMock.mock.calls.map(([url]) => Object.fromEntries(new URL(url, "http://localhost").searchParams));

describe("Home page menu", () => {
    it("shows skeletons while loading, then renders the first page from the API", async () => {
        let resolve;
        const fetchMock = mockFetch(() => new Promise((r) => { resolve = r; }));

        renderApp("/");

        expect(screen.getByLabelText("Loading menu")).toBeInTheDocument();
        expect(requestedParams(fetchMock)[0]).toEqual({ page: "1", limit: "10" });

        resolve(menuServer(MENU)("/api/menu?page=1&limit=10"));

        expect(await screen.findByRole("heading", { name: "Classic Burger" })).toBeInTheDocument();
        expect(screen.getByRole("heading", { name: "Margherita Pizza" })).toBeInTheDocument();
        expect(screen.getByText("₹149.00")).toBeInTheDocument();
        // A single page needs no pagination controls.
        expect(screen.queryByRole("navigation", { name: "Menu pages" })).not.toBeInTheDocument();
    });

    it("shows an error with a working retry", async () => {
        let calls = 0;
        const serve = menuServer(MENU);
        const fetchMock = mockFetch((url) => {
            calls += 1;
            return calls === 1
                ? jsonResponse({ success: false, message: "Internal server error" }, 500)
                : serve(url);
        });

        renderApp("/");

        expect(await screen.findByText("We couldn't load the menu")).toBeInTheDocument();
        expect(screen.getByText("Internal server error")).toBeInTheDocument();

        await userEvent.click(screen.getByRole("button", { name: /try again/i }));

        expect(await screen.findByRole("heading", { name: "Classic Burger" })).toBeInTheDocument();
        expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it("shows an empty state when the menu has no items", async () => {
        mockFetch(menuServer([]));

        renderApp("/");

        expect(await screen.findByText("The kitchen is resting")).toBeInTheDocument();
    });

    it("pages through the menu, at most 10 items per request", async () => {
        const fetchMock = mockFetch(menuServer(manyItems));
        const user = userEvent.setup();

        renderApp("/");

        expect(await screen.findByRole("heading", { name: "Dish 1" })).toBeInTheDocument();
        expect(screen.getAllByRole("article")).toHaveLength(10);
        expect(screen.getByText(/Showing/)).toHaveTextContent("Showing 1–10 of 23 dishes");

        const pager = screen.getByRole("navigation", { name: "Menu pages" });
        expect(within(pager).getByRole("button", { name: "Previous page" })).toBeDisabled();
        expect(within(pager).getByRole("button", { name: "Page 1" })).toHaveAttribute("aria-current", "page");

        await user.click(within(pager).getByRole("button", { name: "Next page" }));

        expect(await screen.findByRole("heading", { name: "Dish 11" })).toBeInTheDocument();
        expect(screen.queryByRole("heading", { name: "Dish 1" })).not.toBeInTheDocument();
        expect(screen.getByText(/Showing/)).toHaveTextContent("Showing 11–20 of 23 dishes");

        await user.click(screen.getByRole("button", { name: "Page 3" }));

        expect(await screen.findByRole("heading", { name: "Dish 21" })).toBeInTheDocument();
        expect(screen.getAllByRole("article")).toHaveLength(3);
        expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();

        const params = requestedParams(fetchMock);
        expect(params.map((p) => p.page)).toEqual(["1", "2", "3"]);
        expect(params.every((p) => p.limit === "10")).toBe(true);
    });

    it("searches on the server and resets to the first page", async () => {
        const fetchMock = mockFetch(menuServer(manyItems));
        const user = userEvent.setup();

        renderApp("/");
        await screen.findByRole("heading", { name: "Dish 1" });

        await user.click(screen.getByRole("button", { name: "Page 2" }));
        await screen.findByRole("heading", { name: "Dish 11" });

        await user.type(screen.getByRole("searchbox", { name: "Search menu" }), "spicy");

        expect(await screen.findByText(/matching “spicy”/)).toHaveTextContent("Showing 1–10 of 11 dishes matching “spicy”");
        expect(screen.getByRole("heading", { name: "Dish 2" })).toBeInTheDocument();
        expect(screen.queryByRole("heading", { name: "Dish 1" })).not.toBeInTheDocument();

        // Debounced: one request for the whole word, on page 1.
        const searches = requestedParams(fetchMock).filter((p) => p.search);
        expect(searches).toEqual([{ page: "1", limit: "10", search: "spicy" }]);
    });

    it("shows a no-results state for a search with no matches", async () => {
        mockFetch(menuServer(MENU));
        const user = userEvent.setup();

        renderApp("/");
        await screen.findByRole("heading", { name: "Classic Burger" });

        await user.type(screen.getByRole("searchbox", { name: "Search menu" }), "sushi");

        expect(await screen.findByText(/No dishes match/)).toBeInTheDocument();
        await user.click(screen.getByRole("button", { name: "Clear search" }));
        expect(await screen.findByRole("heading", { name: "Classic Burger" })).toBeInTheDocument();
    });

    it("adds an item to the cart and updates the navbar count and quantity controls", async () => {
        mockFetch(menuServer(MENU));
        const user = userEvent.setup();

        const { store } = renderApp("/");
        await screen.findByRole("heading", { name: "Classic Burger" });

        await user.click(screen.getByRole("button", { name: "Add Classic Burger to cart" }));

        expect(screen.getByRole("link", { name: "Cart, 1 item" })).toBeInTheDocument();

        const stepper = screen.getByRole("group", { name: "Quantity of Classic Burger" });
        await user.click(within(stepper).getByRole("button", { name: "Increase quantity of Classic Burger" }));

        expect(screen.getByRole("link", { name: "Cart, 2 items" })).toBeInTheDocument();
        expect(store.getState().cart.items).toEqual([
            expect.objectContaining({ id: 1, quantity: 2, pricePaise: 14900 }),
        ]);

        await user.click(within(stepper).getByRole("button", { name: "Decrease quantity of Classic Burger" }));
        await user.click(screen.getByRole("button", { name: "Remove Classic Burger from cart" }));

        await waitFor(() => expect(store.getState().cart.items).toEqual([]));
    });
});
