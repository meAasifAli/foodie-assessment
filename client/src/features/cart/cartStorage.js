
import { toCartLine } from "./cartSlice";

const STORAGE_KEY = "foodie.cart.v1";

/**
 * Reads the persisted cart and re-validates every line through the same
 * rules the reducer uses. Corrupt or tampered data falls back to an empty cart.
 */
export function loadCartState() {
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return undefined;

        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed?.items)) return undefined;

        const seen = new Set();
        const items = [];

        for (const entry of parsed.items) {
            const line = toCartLine(entry, entry?.quantity);
            if (!line || seen.has(line.id)) continue;

            seen.add(line.id);
            items.push(line);
        }

        return { items };
    } catch {
        return undefined;
    }
}

export function saveCartState(cartState) {
    try {
        window.localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ items: cartState.items })
        );
    } catch {
        // Storage can be full or disabled (private mode); the cart still works in memory.
    }
}
