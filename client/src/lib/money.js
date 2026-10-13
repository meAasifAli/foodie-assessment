
// All client-side money maths happens in integer paise to avoid float drift.

const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
});

export function toPaise(value) {
    const amount = Number(value);

    if (!Number.isFinite(amount) || amount < 0) return null;

    return Math.round(amount * 100);
}

export function formatPaise(paise) {
    return formatter.format((Number(paise) || 0) / 100);
}

export function formatPrice(value) {
    return formatPaise(toPaise(value) ?? 0);
}
