
import { useCallback, useRef, useState } from "react";
import { createOrder } from "../services/orderApi";

const STALE_CART_HINT =
    "Some items in your cart may no longer be available. Please review your cart and try again.";

export default function useCheckout() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    // A ref guards against double submits even before React re-renders.
    const inFlightRef = useRef(false);

    const submit = useCallback(async (details, items) => {
        if (inFlightRef.current) return null;

        inFlightRef.current = true;
        setIsSubmitting(true);
        setError("");

        try {
            return await createOrder({ ...details, items });
        } catch (err) {
            const message = err.message || "We couldn't place your order. Please try again.";
            const staleCart = err.status === 404 || err.status === 409;

            setError(staleCart ? `${message}. ${STALE_CART_HINT}` : message);
            return null;
        } finally {
            inFlightRef.current = false;
            setIsSubmitting(false);
        }
    }, []);

    const resetError = useCallback(() => setError(""), []);

    return { submit, isSubmitting, error, resetError };
}
