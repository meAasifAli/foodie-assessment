
import { useCallback, useEffect, useState } from "react";
import { isAbortError } from "../lib/api";
import { fetchMenu } from "../services/menuApi";

const EMPTY_PAGINATION = { page: 1, limit: 10, totalItems: 0, totalPages: 0 };

/**
 * Loads one page of the menu for the given page + search.
 * `loading` is derived by comparing the request key with the key of the
 * last completed response, so the previous page stays visible while the
 * next one loads (no flash of skeletons on every page change).
 */
export default function useMenu({ page = 1, search = "" } = {}) {
    const [requestId, setRequestId] = useState(0);
    const [result, setResult] = useState({
        key: null,
        search: "",
        items: [],
        pagination: EMPTY_PAGINATION,
        error: "",
    });

    const key = `${page}|${search}|${requestId}`;

    useEffect(() => {
        const controller = new AbortController();

        fetchMenu({ page, search, signal: controller.signal })
            .then(({ items, pagination }) => setResult({ key, search, items, pagination, error: "" }))
            .catch((error) => {
                if (isAbortError(error)) return;

                setResult((prev) => ({
                    ...prev,
                    key,
                    search,
                    error: error.message || "Unable to load the menu.",
                }));
            });

        return () => controller.abort();
    }, [key, page, search]);

    const retry = useCallback(() => setRequestId((id) => id + 1), []);

    const loading = result.key !== key;

    return {
        items: result.items,
        // The search the visible items belong to (lags the input while loading).
        resultSearch: result.search,
        pagination: result.pagination,
        error: loading ? "" : result.error,
        loading,
        initialLoading: loading && result.key === null,
        retry,
    };
}
