
import { useCallback, useEffect, useState } from "react";
import { isAbortError } from "../lib/api";
import { fetchOrders } from "../services/orderApi";

export default function useOrders() {
    const [state, setState] = useState({ orders: [], loading: true, error: "" });
    const [requestId, setRequestId] = useState(0);

    useEffect(() => {
        const controller = new AbortController();

        fetchOrders({ signal: controller.signal })
            .then((orders) => setState({ orders, loading: false, error: "" }))
            .catch((error) => {
                if (isAbortError(error)) return;

                setState({
                    orders: [],
                    loading: false,
                    error: error.message || "Unable to load orders.",
                });
            });

        return () => controller.abort();
    }, [requestId]);

    const retry = useCallback(() => {
        setState((prev) => ({ ...prev, loading: true, error: "" }));
        setRequestId((id) => id + 1);
    }, []);

    return { ...state, retry };
}
