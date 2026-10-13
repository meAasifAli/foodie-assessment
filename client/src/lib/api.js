
export class ApiError extends Error {
    constructor(message, status = 0) {
        super(message);
        this.name = "ApiError";
        this.status = status;
    }
}

const FALLBACK_MESSAGES = {
    0: "Unable to reach the server. Check your connection and try again.",
    404: "We couldn't find what you were looking for.",
    500: "Something went wrong on our side. Please try again.",
};

function fallbackMessage(status) {
    if (status >= 500) return FALLBACK_MESSAGES[500];
    return FALLBACK_MESSAGES[status] || "The request could not be completed.";
}

async function parseBody(response) {
    const text = await response.text();

    if (!text) return null;

    try {
        return JSON.parse(text);
    } catch {
        // Non-JSON responses (e.g. a proxy error page) are treated as empty.
        return null;
    }
}

/**
 * Thin wrapper around fetch for the Express API.
 * Resolves with the parsed `{ success, data, ... }` payload or throws ApiError.
 * AbortErrors are re-thrown untouched so callers can ignore them.
 */
export async function apiRequest(path, { method = "GET", body, signal } = {}) {
    let response;

    try {
        response = await fetch(path, {
            method,
            signal,
            headers: body === undefined
                ? { Accept: "application/json" }
                : { Accept: "application/json", "Content-Type": "application/json" },
            body: body === undefined ? undefined : JSON.stringify(body),
        });
    } catch (error) {
        if (error?.name === "AbortError") throw error;
        throw new ApiError(fallbackMessage(0), 0);
    }

    const payload = await parseBody(response);

    if (!response.ok || payload?.success === false) {
        const message =
            typeof payload?.message === "string" && payload.message
                ? payload.message
                : fallbackMessage(response.status);

        throw new ApiError(message, response.status);
    }

    if (!payload || typeof payload !== "object") {
        throw new ApiError("The server returned an unexpected response.", response.status);
    }

    return payload;
}

export function isAbortError(error) {
    return error?.name === "AbortError";
}
