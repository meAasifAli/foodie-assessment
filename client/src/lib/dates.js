
const dateTimeFormatter = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" });

export function formatDateTime(value) {
    const date = value ? new Date(value) : null;
    return date && !Number.isNaN(date.getTime()) ? dateTimeFormatter.format(date) : "";
}
