
import { describe, expect, it } from "vitest";
import { validateCheckout } from "./validation";

const valid = {
    customerName: "Aasif Ali",
    deliveryAddress: "Bengaluru, Karnataka",
    phone: "9876543210",
};

describe("validateCheckout", () => {
    it("accepts valid details", () => {
        expect(validateCheckout(valid)).toEqual({});
        expect(validateCheckout({ ...valid, phone: "+91 98765-43210" })).toEqual({});
    });

    it("requires every field", () => {
        const errors = validateCheckout({ customerName: "  ", deliveryAddress: "", phone: "" });

        expect(Object.keys(errors).sort()).toEqual(["customerName", "deliveryAddress", "phone"]);
    });

    it.each(["12345", "98765abcde", "1234567890123456", "98765.43210"])(
        "rejects invalid phone %s",
        (phone) => {
            expect(validateCheckout({ ...valid, phone }).phone).toBeTruthy();
        }
    );
});
