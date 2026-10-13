
// Client-side checks are a UX convenience; order.service.js still validates
// everything. The phone rule is a stricter subset of the backend's
// /^[0-9+\-\s()]{7,20}$/ so anything accepted here is accepted there.
const PHONE_CHARS = /^[0-9+\-\s()]+$/;

export const CHECKOUT_LIMITS = {
    nameMax: 150,
    addressMax: 500,
};

export function validateCheckout({ customerName = "", deliveryAddress = "", phone = "" }) {
    const errors = {};
    const name = customerName.trim();
    const address = deliveryAddress.trim();
    const phoneValue = phone.trim();
    const digits = phoneValue.replace(/\D/g, "");

    if (!name) {
        errors.customerName = "Please enter your name.";
    } else if (name.length < 2) {
        errors.customerName = "Name must be at least 2 characters.";
    } else if (name.length > CHECKOUT_LIMITS.nameMax) {
        errors.customerName = `Name must be ${CHECKOUT_LIMITS.nameMax} characters or fewer.`;
    }

    if (!address) {
        errors.deliveryAddress = "Please enter a delivery address.";
    } else if (address.length < 5) {
        errors.deliveryAddress = "Please enter a complete delivery address.";
    } else if (address.length > CHECKOUT_LIMITS.addressMax) {
        errors.deliveryAddress = `Address must be ${CHECKOUT_LIMITS.addressMax} characters or fewer.`;
    }

    if (!phoneValue) {
        errors.phone = "Please enter a phone number.";
    } else if (
        !PHONE_CHARS.test(phoneValue) ||
        phoneValue.length > 20 ||
        digits.length < 10 ||
        digits.length > 13
    ) {
        errors.phone = "Enter a valid phone number, e.g. 9876543210.";
    }

    return errors;
}
