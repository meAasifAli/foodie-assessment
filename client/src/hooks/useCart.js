
import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    addToCart,
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
    clearCart,
    selectCartItems,
    selectCartCount,
    selectCartSubtotalPaise,
} from "../features/cart/cartSlice";

export default function useCart() {
    const dispatch = useDispatch();
    const items = useSelector(selectCartItems);
    const itemCount = useSelector(selectCartCount);
    const subtotalPaise = useSelector(selectCartSubtotalPaise);

    const quantityById = useMemo(
        () => new Map(items.map((item) => [item.id, item.quantity])),
        [items]
    );

    const getQuantity = useCallback((id) => quantityById.get(id) ?? 0, [quantityById]);

    const addItem = useCallback((product) => dispatch(addToCart(product)), [dispatch]);
    const increment = useCallback((id) => dispatch(incrementQuantity(id)), [dispatch]);
    const decrement = useCallback((id) => dispatch(decrementQuantity(id)), [dispatch]);
    const removeItem = useCallback((id) => dispatch(removeFromCart(id)), [dispatch]);
    const clear = useCallback(() => dispatch(clearCart()), [dispatch]);

    return {
        items,
        itemCount,
        subtotalPaise,
        isEmpty: items.length === 0,
        getQuantity,
        addItem,
        increment,
        decrement,
        removeItem,
        clear,
    };
}
