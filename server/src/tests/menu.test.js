import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import request from "supertest";

// Mock the repository so these tests don't depend on PostgreSQL.
vi.mock("../repositories/menu.repository.js", () => ({
    findAll: vi.fn(),
    findAvailablePage: vi.fn(),
}));

import * as menuRepository from "../repositories/menu.repository.js";
import app from "../app.js";

const mockMenuItems = [
    {
        id: 1,
        name: "Classic Burger",
        description: "Grilled patty with lettuce and cheese",
        price: "149.00",
        image_url: "https://example.com/burger.jpg",
        is_available: true,
    },
    {
        id: 2,
        name: "Margherita Pizza",
        description: "Mozzarella, basil and tomato sauce",
        price: "249.00",
        image_url: "https://example.com/pizza.jpg",
        is_available: true,
    },
];

describe("GET /api/menu", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("should return the first page of available menu items by default", async () => {
        menuRepository.findAvailablePage.mockResolvedValue({ items: mockMenuItems, total: 2 });

        const response = await request(app)
            .get("/api/menu")
            .expect("Content-Type", /json/)
            .expect(200);

        expect(response.body).toEqual({
            success: true,
            count: 2,
            data: mockMenuItems,
            pagination: {
                page: 1,
                limit: 10,
                totalItems: 2,
                totalPages: 1,
                hasNextPage: false,
                hasPrevPage: false,
            },
        });

        expect(menuRepository.findAvailablePage).toHaveBeenCalledWith({
            limit: 10,
            offset: 0,
            search: "",
        });
    });

    it("should return an empty array when no menu items are available", async () => {
        menuRepository.findAvailablePage.mockResolvedValue({ items: [], total: 0 });

        const response = await request(app)
            .get("/api/menu")
            .expect(200);

        expect(response.body).toMatchObject({
            success: true,
            count: 0,
            data: [],
            pagination: { totalItems: 0, totalPages: 0, hasNextPage: false },
        });
    });

    it("should apply page, limit and trimmed search to the query", async () => {
        menuRepository.findAvailablePage.mockResolvedValue({ items: mockMenuItems, total: 56 });

        const response = await request(app)
            .get("/api/menu?page=3&limit=10&search=%20pizza%20")
            .expect(200);

        expect(menuRepository.findAvailablePage).toHaveBeenCalledWith({
            limit: 10,
            offset: 20,
            search: "pizza",
        });

        expect(response.body.pagination).toEqual({
            page: 3,
            limit: 10,
            totalItems: 56,
            totalPages: 6,
            hasNextPage: true,
            hasPrevPage: true,
        });
    });

    it("should reject a limit above the maximum page size of 10", async () => {
        const response = await request(app)
            .get("/api/menu?limit=11")
            .expect(400);

        expect(response.body).toEqual({
            success: false,
            message: "limit must be between 1 and 10",
        });
        expect(menuRepository.findAvailablePage).not.toHaveBeenCalled();
    });

    it.each(["0", "-1", "abc", "1.5"])(
        "should reject an invalid page value: %s",
        async (page) => {
            vi.spyOn(console, "error").mockImplementation(() => { });

            const response = await request(app)
                .get(`/api/menu?page=${page}`)
                .expect(400);

            expect(response.body.message).toBe("page must be a positive integer");
            expect(menuRepository.findAvailablePage).not.toHaveBeenCalled();
        }
    );

    it("should return a 500 response when the repository fails", async () => {
        menuRepository.findAvailablePage.mockRejectedValue(
            new Error("Database connection failed")
        );

        // Avoid printing the expected error during this test.
        vi.spyOn(console, "error").mockImplementation(() => { });

        const response = await request(app)
            .get("/api/menu")
            .expect(500);

        expect(response.body).toEqual({
            success: false,
            message: "Internal server error",
        });
    });
});
