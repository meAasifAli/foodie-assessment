
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../features/cart/cartSlice";
import { loadCartState, saveCartState } from "../features/cart/cartStorage";

export function makeStore(preloadedState) {
    return configureStore({
        reducer: {
            cart: cartReducer,
        },
        preloadedState,
    });
}

const persistedCart = loadCartState();

export const store = makeStore(persistedCart ? { cart: persistedCart } : undefined);

let lastSavedCart = store.getState().cart;

store.subscribe(() => {
    const { cart } = store.getState();

    if (cart !== lastSavedCart) {
        lastSavedCart = cart;
        saveCartState(cart);
    }
});
