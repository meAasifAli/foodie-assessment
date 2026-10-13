
import { ApiError, apiRequest } from "../lib/api";
import { toPaise } from "../lib/money";

export const ORDER_STATUSES = [
    "RECEIVED",
    "PREPARING",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "CANCELLED",
];

export const TERMINAL_STATUSES = ["DELIVERED", "CANCELLED"];

// POST /api/orders returns camelCase items, GET /api/orders/:id returns
// snake_case rows straight from SQL. Normalise both into one shape.
function normalizeOrderItem(raw) {
    const quantity = Number(raw?.quantity) || 0;
    const unitPricePaise = toPaise(raw?.unitPrice ?? raw?.unit_price) ?? 0;
    const subtotalPaise =
        toPaise(raw?.subtotal) ?? unitPricePaise * quantity;

    return {
        menuItemId: Number(raw?.menuItemId ?? raw?.menu_item_id),
        name: typeof raw?.name === "string" ? raw.name : "Menu item",
        quantity,
        unitPricePaise,
        subtotalPaise,
    };
}

function normalizeOrder(raw) {
    if (!raw || typeof raw !== "object" || raw.id === undefined || raw.id === null) {
        throw new ApiError("The order response was not in the expected format.");
    }

    return {
        id: String(raw.id),
        customerName: raw.customer_name ?? "",
        deliveryAddress: raw.delivery_address ?? "",
        phone: raw.phone ?? "",
        status: ORDER_STATUSES.includes(raw.status) ? raw.status : "RECEIVED",
        totalPaise: toPaise(raw.total_amount) ?? 0,
        createdAt: raw.created_at ?? null,
        updatedAt: raw.updated_at ?? null,
        items: Array.isArray(raw.items) ? raw.items.map(normalizeOrderItem) : [],
    };
}

/**
 * Only IDs and quantities are sent — PostgreSQL is the source of truth
 * for prices and the order total.
 */
export async function createOrder({ customerName, deliveryAddress, phone, items }) {
    const payload = await apiRequest("/api/orders", {
        method: "POST",
        body: {
            customerName,
            deliveryAddress,
            phone,
            items: items.map(({ id, quantity }) => ({ menuItemId: id, quantity })),
        },
    });

    return normalizeOrder(payload.data);
}

/** GET /api/orders — order rows only; line items are not included. */
export async function fetchOrders({ signal } = {}) {
    const payload = await apiRequest("/api/orders", { signal });

    if (!Array.isArray(payload.data)) {
        throw new ApiError("The orders response was not in the expected format.");
    }

    return payload.data.map(normalizeOrder);
}

export async function fetchOrder(id, { signal } = {}) {
    const payload = await apiRequest(`/api/orders/${encodeURIComponent(id)}`, { signal });

    return normalizeOrder(payload.data);
}
