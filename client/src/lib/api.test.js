
import { describe, expect, it, vi } from "vitest";
import { ApiError, apiRequest } from "./api";

describe("apiRequest", () => {
    it("returns the parsed payload on success", async () => {
        vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({ success: true, data: [1] }))));

        await expect(apiRequest("/api/menu")).resolves.toEqual({ success: true, data: [1] });
    });

    it("surfaces the server's error message and status", async () => {
        vi.stubGlobal(
            "fetch",
            vi.fn(async () => new Response(JSON.stringify({ success: false, message: "Order not found" }), { status: 404 }))
        );

        await expect(apiRequest("/api/orders/9")).rejects.toMatchObject({
            name: "ApiError",
            message: "Order not found",
            status: 404,
        });
    });

    it("handles non-JSON error bodies safely", async () => {
        vi.stubGlobal("fetch", vi.fn(async () => new Response("<html>Bad gateway</html>", { status: 502 })));

        const error = await apiRequest("/api/menu").catch((err) => err);

        expect(error).toBeInstanceOf(ApiError);
        expect(error.status).toBe(502);
        expect(error.message).toMatch(/something went wrong/i);
    });

    it("maps network failures to a friendly message", async () => {
        vi.stubGlobal("fetch", vi.fn(async () => { throw new TypeError("Failed to fetch"); }));

        await expect(apiRequest("/api/menu")).rejects.toMatchObject({ status: 0, message: expect.stringMatching(/unable to reach/i) });
    });
});
