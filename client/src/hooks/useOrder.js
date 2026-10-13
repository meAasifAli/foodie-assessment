
import { useCallback, useEffect, useRef, useState } from "react";
import { isAbortError } from "../lib/api";
import { fetchOrder, TERMINAL_STATUSES } from "../services/orderApi";

export const ORDER_POLL_INTERVAL_MS = 15000;

/**
 * Loads an order and, while it is still in progress, re-fetches it at a
 * modest interval (paused while the tab is hidden). Polling stops once the
 * order is DELIVERED or CANCELLED. This is plain HTTP polling, not real-time.
 */
export default function useOrder(id, { pollInterval = ORDER_POLL_INTERVAL_MS } = {}) {
    const [state, setState] = useState({
        order: null,
        loading: true,
        refreshing: false,
        error: "",
        errorStatus: null,
        lastUpdated: null,
    });
    const controllerRef = useRef(null);

    const load = useCallback(async () => {
        controllerRef.current?.abort();
        const controller = new AbortController();
        controllerRef.current = controller;

        try {
            const order = await fetchOrder(id, { signal: controller.signal });

            setState({
                order,
                loading: false,
                refreshing: false,
                error: "",
                errorStatus: null,
                lastUpdated: new Date(),
            });
        } catch (error) {
            if (isAbortError(error)) return;

            // Keep the last good order on screen if a background refresh fails.
            setState((prev) => ({
                ...prev,
                loading: false,
                refreshing: false,
                error: error.message || "Unable to load this order.",
                errorStatus: error.status ?? null,
            }));
        }
    }, [id]);

    useEffect(() => {
        load();
        return () => controllerRef.current?.abort();
    }, [load]);

    const status = state.order?.status;
    const shouldPoll =
        pollInterval > 0 && Boolean(status) && !TERMINAL_STATUSES.includes(status);

    useEffect(() => {
        if (!shouldPoll) return undefined;

        const timer = window.setInterval(() => {
            if (document.visibilityState === "visible") load();
        }, pollInterval);

        return () => window.clearInterval(timer);
    }, [shouldPoll, pollInterval, load]);

    const refresh = useCallback(() => {
        setState((prev) => ({
            ...prev,
            loading: !prev.order,
            refreshing: Boolean(prev.order),
            error: "",
        }));
        load();
    }, [load]);

    return { ...state, isPolling: shouldPoll, refresh };
}
