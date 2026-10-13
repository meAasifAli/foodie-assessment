
import { createSelector, createSlice } from "@reduxjs/toolkit";

// Mirrors the backend's per-line limit in order.service.js.
export const MAX_QUANTITY = 99;

const isValidId = (id) => Number.isSafeInteger(id) && id > 0;

/**
 * Cart lines keep only what the UI needs to render. The price is a display
 * snapshot in paise — the backend recalculates the real total at checkout.
 */
export function toCartLine(product, quantity = 1) {
    if (!product || !isValidId(product.id)) return null;
    if (product.isAvailable === false) return null;
    if (!Number.isSafeInteger(product.pricePaise) || product.pricePaise < 0) return null;
    if (typeof product.name !== "string" || !product.name) return null;
    if (!Number.isSafeInteger(quantity) || quantity < 1) return null;

    return {
        id: product.id,
        name: product.name,
        pricePaise: product.pricePaise,
        imageUrl: typeof product.imageUrl === "string" ? product.imageUrl : "",
        quantity: Math.min(quantity, MAX_QUANTITY),
    };
}

const initialState = { items: [] };

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart(state, action) {
            const line = toCartLine(action.payload);
            if (!line) return;

            const existing = state.items.find((item) => item.id === line.id);

            if (existing) {
                existing.quantity = Math.min(existing.quantity + 1, MAX_QUANTITY);
            } else {
                state.items.push(line);
            }
        },

        incrementQuantity(state, action) {
            const item = state.items.find((entry) => entry.id === action.payload);
            if (item) item.quantity = Math.min(item.quantity + 1, MAX_QUANTITY);
        },

        decrementQuantity(state, action) {
            const item = state.items.find((entry) => entry.id === action.payload);
            if (!item) return;

            if (item.quantity <= 1) {
                state.items = state.items.filter((entry) => entry.id !== action.payload);
            } else {
                item.quantity -= 1;
            }
        },

        removeFromCart(state, action) {
            state.items = state.items.filter((item) => item.id !== action.payload);
        },

        clearCart(state) {
            state.items = [];
        },
    },
});

export const {
    addToCart,
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
    clearCart,
} = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;

export const selectCartCount = createSelector([selectCartItems], (items) =>
    items.reduce((total, item) => total + item.quantity, 0)
);

export const selectCartSubtotalPaise = createSelector([selectCartItems], (items) =>
    items.reduce((total, item) => total + item.pricePaise * item.quantity, 0)
);

export default cartSlice.reducer;
