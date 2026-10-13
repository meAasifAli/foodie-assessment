
import { ApiError, apiRequest } from "../lib/api";
import { toPaise } from "../lib/money";

function normalizeMenuItem(raw) {
    if (!raw || typeof raw !== "object") return null;

    const id = Number(raw.id);
    const pricePaise = toPaise(raw.price);

    if (!Number.isSafeInteger(id) || id <= 0) return null;
    if (typeof raw.name !== "string" || !raw.name.trim()) return null;
    if (pricePaise === null) return null;

    return {
        id,
        name: raw.name.trim(),
        description: typeof raw.description === "string" ? raw.description : "",
        pricePaise,
        imageUrl: typeof raw.image_url === "string" ? raw.image_url : "",
        isAvailable: raw.is_available !== false,
    };
}

export const MENU_PAGE_SIZE = 10;

const toCount = (value, fallback) =>
    Number.isSafeInteger(value) && value >= 0 ? value : fallback;

/**
 * Fetches one page of the menu. Search runs on the server so it covers
 * every page, not just the items currently loaded.
 */
export async function fetchMenu({ page = 1, search = "", signal } = {}) {
    const params = new URLSearchParams({ page: String(page), limit: String(MENU_PAGE_SIZE) });
    if (search) params.set("search", search);

    const payload = await apiRequest(`/api/menu?${params}`, { signal });

    if (!Array.isArray(payload.data)) {
        throw new ApiError("The menu response was not in the expected format.");
    }

    // Drop malformed rows rather than crashing the whole menu.
    const items = payload.data.map(normalizeMenuItem).filter(Boolean);
    const raw = payload.pagination ?? {};
    const totalItems = toCount(raw.totalItems, items.length);
    const limit = toCount(raw.limit, MENU_PAGE_SIZE) || MENU_PAGE_SIZE;

    return {
        items,
        pagination: {
            page: toCount(raw.page, page) || page,
            limit,
            totalItems,
            totalPages: toCount(raw.totalPages, Math.ceil(totalItems / limit)),
        },
    };
}
