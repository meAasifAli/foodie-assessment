
import * as orderRepository from "../repositories/order.repository.js";

const VALID_STATUSES = [
    "RECEIVED",
    "PREPARING",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "CANCELLED",
];

const STATUS_TRANSITIONS = {
    RECEIVED: ["PREPARING", "CANCELLED"],
    PREPARING: ["OUT_FOR_DELIVERY", "CANCELLED"],
    OUT_FOR_DELIVERY: ["DELIVERED"],
    DELIVERED: [],
    CANCELLED: [],
};

const fail = (message, status = 400) => {
    const error = new Error(message);
    error.status = status;
    throw error;
};

const validateId = (id) => {
    if (!/^[1-9]\d*$/.test(String(id))) {
        fail("Invalid order ID");
    }

    const parsed = Number(id);

    if (!Number.isSafeInteger(parsed)) {
        fail("Invalid order ID");
    }

    return parsed;
};

export const getOrders = () => orderRepository.findAll();

export const getOrderById = async (id) => {
    const orderId = validateId(id);
    const order = await orderRepository.findById(orderId);

    if (!order) fail("Order not found", 404);

    order.items = await orderRepository.findItemsByOrderId(orderId);

    return order;
};

export const createOrder = async (payload) => {
    const {
        customerName,
        deliveryAddress,
        phone,
        items,
    } = payload || {};

    if (
        typeof customerName !== "string" ||
        !customerName.trim()
    ) {
        fail("Customer name is required");
    }

    if (
        typeof deliveryAddress !== "string" ||
        !deliveryAddress.trim()
    ) {
        fail("Delivery address is required");
    }

    if (
        typeof phone !== "string" ||
        !/^[0-9+\-\s()]{7,20}$/.test(phone.trim())
    ) {
        fail("A valid phone number is required");
    }

    if (!Array.isArray(items) || items.length === 0) {
        fail("Cart must contain at least one item");
    }

    if (items.length > 50) {
        fail("Too many distinct items in one order");
    }

    const seenIds = new Set();

    for (const item of items) {
        if (
            !item ||
            !Number.isSafeInteger(item.menuItemId) ||
            item.menuItemId <= 0
        ) {
            fail("Each item must have a valid menu item ID");
        }

        if (
            !Number.isSafeInteger(item.quantity) ||
            item.quantity < 1 ||
            item.quantity > 99
        ) {
            fail("Item quantity must be between 1 and 99");
        }

        if (seenIds.has(item.menuItemId)) {
            fail("Each menu item must appear only once in the cart");
        }

        seenIds.add(item.menuItemId);
    }

    return orderRepository.create({
        customerName: customerName.trim(),
        deliveryAddress: deliveryAddress.trim(),
        phone: phone.trim(),
        items,
    });
};

export const changeOrderStatus = async (id, status) => {
    const orderId = validateId(id);

    if (!VALID_STATUSES.includes(status)) {
        fail("Invalid order status");
    }

    const currentOrder = await orderRepository.findById(orderId);

    if (!currentOrder) fail("Order not found", 404);

    if (!STATUS_TRANSITIONS[currentOrder.status]?.includes(status)) {
        fail(
            `Cannot change order status from ${currentOrder.status} to ${status}`,
            409
        );
    }

    return orderRepository.updateStatus(orderId, status);
};

export const updateOrderDetails = async (id, payload) => {
    const orderId = validateId(id);
    const { customerName, deliveryAddress, phone } = payload || {};

    if (
        typeof customerName !== "string" ||
        !customerName.trim() ||
        typeof deliveryAddress !== "string" ||
        !deliveryAddress.trim() ||
        typeof phone !== "string" ||
        !/^[0-9+\-\s()]{7,20}$/.test(phone.trim())
    ) {
        fail("Valid customer name, address, and phone are required");
    }

    const currentOrder = await orderRepository.findById(orderId);

    if (!currentOrder) fail("Order not found", 404);

    if (currentOrder.status !== "RECEIVED") {
        fail("Order details can only be changed while status is RECEIVED", 409);
    }

    return orderRepository.updateDetails(orderId, {
        customerName: customerName.trim(),
        deliveryAddress: deliveryAddress.trim(),
        phone: phone.trim(),
    });
};

export const deleteOrder = async (id) => {
    const orderId = validateId(id);
    const order = await orderRepository.remove(orderId);

    if (!order) {
        fail("Order not found or cannot be deleted in its current status", 409);
    }

    return order;
};
