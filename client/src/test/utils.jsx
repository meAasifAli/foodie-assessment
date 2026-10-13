
import { useEffect } from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, useLocation } from "react-router-dom";
import { vi } from "vitest";

import App from "../App";
import { makeStore } from "../app/store";

export const MENU = [
    {
        id: 1,
        name: "Classic Burger",
        description: "Grilled patty with lettuce, tomato and cheese",
        price: "149.00",
        image_url: "https://images.unsplash.com/photo-1",
        is_available: true,
    },
    {
        id: 2,
        name: "Margherita Pizza",
        description: "Mozzarella, fresh basil and tomato sauce",
        price: "249.00",
        image_url: "https://images.unsplash.com/photo-2",
        is_available: true,
    },
];

export const cartLine = (overrides = {}) => ({
    id: 1,
    name: "Classic Burger",
    pricePaise: 14900,
    imageUrl: "",
    quantity: 1,
    ...overrides,
});

export function jsonResponse(body, status = 200) {
    return new Response(JSON.stringify(body), {
        status,
        headers: { "Content-Type": "application/json" },
    });
}

/** Stubs global fetch with a handler `(url, init) => Response | Promise<Response>`. */
export function mockFetch(handler) {
    const fetchMock = vi.fn((url, init = {}) => Promise.resolve(handler(String(url), init)));
    vi.stubGlobal("fetch", fetchMock);
    return fetchMock;
}

function LocationProbe({ onChange }) {
    const location = useLocation();

    useEffect(() => {
        onChange(location);
    }, [onChange, location]);

    return null;
}

export function renderApp(route = "/", { cartItems = [] } = {}) {
    const store = makeStore({ cart: { items: cartItems } });
    let location = null;
    const trackLocation = (next) => {
        location = next;
    };

    const utils = render(
        <Provider store={store}>
            <MemoryRouter initialEntries={[route]}>
                <App />
                <LocationProbe onChange={trackLocation} />
            </MemoryRouter>
        </Provider>
    );

    return { ...utils, store, getLocation: () => location };
}
