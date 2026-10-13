
import { beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";

vi.mock("../services/order.service.js", () => ({
    getOrders: vi.fn(),
    getOrderById: vi.fn(),
    changeOrderStatus: vi.fn(),
    updateOrderDetails: vi.fn(),
    deleteOrder: vi.fn(),
    createOrder: vi.fn(),
}));

import app from "../app.js";
import * as orderService from "../services/order.service.js";

beforeEach(() => {
    vi.clearAllMocks();
});

describe("GET /api/orders", () => {
    it("should return all orders", async () => {
        orderService.getOrders.mockResolvedValue([
            { id: 1, customerName: "Aasif Ali", status: "RECEIVED" },
            { id: 2, customerName: "John Doe", status: "PREPARING" },
        ]);

        const response = await request(app)
            .get("/api/orders")
            .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.count).toBe(2);
        expect(response.body.data).toHaveLength(2);
    });

    it("should return an empty array when there are no orders", async () => {
        orderService.getOrders.mockResolvedValue([]);

        const response = await request(app)
            .get("/api/orders")
            .expect(200);

        expect(response.body.data).toEqual([]);
        expect(response.body.count).toBe(0);
    });
});

describe("GET /api/orders/:id", () => {
    it("should return an order by ID", async () => {
        orderService.getOrderById.mockResolvedValue({
            id: 1001,
            customerName: "Aasif Ali",
            status: "RECEIVED",
            items: [],
        });

        const response = await request(app)
            .get("/api/orders/1001")
            .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(1001);
    });

    it("should return 404 when an order does not exist", async () => {
        orderService.getOrderById.mockRejectedValue(
            Object.assign(new Error("Order not found"), { status: 404 })
        );

        const response = await request(app)
            .get("/api/orders/99999")
            .expect(404);

        expect(response.body.message).toBe("Order not found");
    });

    it("should reject an invalid order ID", async () => {
        orderService.getOrderById.mockRejectedValue(
            Object.assign(new Error("Invalid order ID"), { status: 400 })
        );

        await request(app)
            .get("/api/orders/abc")
            .expect(400);
    });
});

describe("PATCH /api/orders/:id", () => {
    it("should update customer details", async () => {
        orderService.updateOrderDetails.mockResolvedValue({
            id: 1001,
            customerName: "Aasif Khan",
            deliveryAddress: "Indiranagar, Bengaluru",
            phone: "9876543210",
            status: "RECEIVED",
        });

        const response = await request(app)
            .patch("/api/orders/1001")
            .send({
                customerName: "Aasif Khan",
                deliveryAddress: "Indiranagar, Bengaluru",
                phone: "9876543210",
            })
            .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.customerName).toBe("Aasif Khan");
        expect(orderService.updateOrderDetails).toHaveBeenCalledWith(
            "1001",
            {
                customerName: "Aasif Khan",
                deliveryAddress: "Indiranagar, Bengaluru",
                phone: "9876543210",
            }
        );
    });

    it("should reject updates when the order cannot be edited", async () => {
        orderService.updateOrderDetails.mockRejectedValue(
            Object.assign(
                new Error("Order details can only be updated before preparation"),
                { status: 409 }
            )
        );

        await request(app)
            .patch("/api/orders/1001")
            .send({
                customerName: "Aasif Khan",
                deliveryAddress: "Bengaluru",
                phone: "9876543210",
            })
            .expect(409);
    });
});

describe("PATCH /api/orders/:id/status", () => {
    it("should update an order status", async () => {
        orderService.changeOrderStatus.mockResolvedValue({
            id: 1001,
            status: "PREPARING",
        });

        const response = await request(app)
            .patch("/api/orders/1001/status")
            .send({ status: "PREPARING" })
            .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.status).toBe("PREPARING");
    });

    it("should reject an invalid status", async () => {
        orderService.changeOrderStatus.mockRejectedValue(
            Object.assign(new Error("Invalid order status"), { status: 400 })
        );

        const response = await request(app)
            .patch("/api/orders/1001/status")
            .send({ status: "FLYING" })
            .expect(400);

        expect(response.body.message).toBe("Invalid order status");
    });

    it("should reject an invalid status transition", async () => {
        orderService.changeOrderStatus.mockRejectedValue(
            Object.assign(
                new Error("Invalid order status transition"),
                { status: 409 }
            )
        );

        await request(app)
            .patch("/api/orders/1001/status")
            .send({ status: "DELIVERED" })
            .expect(409);
    });
});

describe("DELETE /api/orders/:id", () => {
    it("should delete an eligible order", async () => {
        orderService.deleteOrder.mockResolvedValue({ id: 1001 });

        const response = await request(app)
            .delete("/api/orders/1001")
            .expect(200);

        expect(response.body.success).toBe(true);
        expect(orderService.deleteOrder).toHaveBeenCalledWith("1001");
    });

    it("should reject deleting an order that cannot be deleted", async () => {
        orderService.deleteOrder.mockRejectedValue(
            Object.assign(
                new Error("Order not found or cannot be deleted in its current status"),
                { status: 409 }
            )
        );

        await request(app)
            .delete("/api/orders/1001")
            .expect(409);
    });
});
