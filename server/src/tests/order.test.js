
import {
    describe,
    it,
    expect,
    vi,
    beforeEach,
} from "vitest";
import request from "supertest";

vi.mock("../services/order.service.js", () => ({
    createOrder: vi.fn(),
}));

import * as orderService from "../services/order.service.js";
import app from "../app.js";

describe("POST /api/orders", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should create an order and return 201", async () => {
        const requestBody = {
            customerName: "Aasif Ali",
            deliveryAddress: "Bengaluru, Karnataka",
            phone: "9876543210",
            items: [
                { menuItemId: 1, quantity: 2 },
                { menuItemId: 2, quantity: 1 },
            ],
        };

        orderService.createOrder.mockResolvedValue({
            id: 1001,
            status: "RECEIVED",
            totalAmount: "547.00",
            items: [
                {
                    menuItemId: 1,
                    name: "Classic Burger",
                    quantity: 2,
                    unitPrice: "149.00",
                    subtotal: "298.00",
                },
                {
                    menuItemId: 2,
                    name: "Margherita Pizza",
                    quantity: 1,
                    unitPrice: "249.00",
                    subtotal: "249.00",
                },
            ],
        });

        const response = await request(app)
            .post("/api/orders")
            .send(requestBody)
            .expect("Content-Type", /json/)
            .expect(201);

        expect(response.body).toEqual({
            success: true,
            message: "Order placed successfully",
            data: expect.objectContaining({
                id: 1001,
                status: "RECEIVED",
                totalAmount: "547.00",
            }),
        });

        expect(orderService.createOrder).toHaveBeenCalledWith(
            requestBody
        );
    });

    it("should return 400 for invalid checkout details", async () => {
        orderService.createOrder.mockRejectedValue(
            Object.assign(new Error("Customer name is required"), {
                status: 400,
            })
        );

        const response = await request(app)
            .post("/api/orders")
            .send({
                customerName: "",
                deliveryAddress: "Bengaluru",
                phone: "9876543210",
                items: [{ menuItemId: 1, quantity: 1 }],
            })
            .expect(400);

        expect(response.body).toEqual({
            success: false,
            message: "Customer name is required",
        });
    });

    it("should return 404 when a menu item does not exist", async () => {
        orderService.createOrder.mockRejectedValue(
            Object.assign(new Error("Menu item not found"), {
                status: 404,
            })
        );

        const response = await request(app)
            .post("/api/orders")
            .send({
                customerName: "Aasif Ali",
                deliveryAddress: "Bengaluru",
                phone: "9876543210",
                items: [{ menuItemId: 99999, quantity: 1 }],
            })
            .expect(404);

        expect(response.body.message).toBe("Menu item not found");
    });

    it("should return 409 when a menu item is unavailable", async () => {
        orderService.createOrder.mockRejectedValue(
            Object.assign(new Error("Menu item is unavailable"), {
                status: 409,
            })
        );

        const response = await request(app)
            .post("/api/orders")
            .send({
                customerName: "Aasif Ali",
                deliveryAddress: "Bengaluru",
                phone: "9876543210",
                items: [{ menuItemId: 1, quantity: 1 }],
            })
            .expect(409);

        expect(response.body.message).toBe(
            "Menu item is unavailable"
        );
    });

    it("should return a safe 500 response on unexpected errors", async () => {
        orderService.createOrder.mockRejectedValue(
            new Error("Database connection failed")
        );

        vi.spyOn(console, "error").mockImplementation(() => { });

        const response = await request(app)
            .post("/api/orders")
            .send({
                customerName: "Aasif Ali",
                deliveryAddress: "Bengaluru",
                phone: "9876543210",
                items: [{ menuItemId: 1, quantity: 1 }],
            })
            .expect(500);

        expect(response.body).toEqual({
            success: false,
            message: "Internal server error",
        });
    });
});
