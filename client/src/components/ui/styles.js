// Shared so router <Link>s can look like buttons without nesting <button> in <a>,
// and so inputs and textareas stay visually identical.
const variants = {
    default:
        "bg-primary text-white shadow-sm hover:bg-primary-hover",
    outline:
        "border border-border bg-surface text-foreground hover:border-border-strong hover:bg-surface-muted",
    secondary:
        "bg-surface-muted text-foreground hover:bg-border",
    ghost:
        "text-foreground hover:bg-surface-muted",
    "ghost-danger":
        "text-muted hover:bg-danger-light hover:text-danger",
    destructive:
        "bg-danger text-white hover:opacity-90",
    "destructive-outline":
        "border border-danger/30 bg-surface text-danger hover:bg-danger-light",
    link:
        "text-primary underline-offset-4 hover:underline",
};

const sizes = {
    default: "h-11 px-5",
    sm: "h-9 rounded-lg px-3 text-sm",
    lg: "h-12 rounded-button px-7 text-base",
    icon: "size-10",
    "icon-sm": "size-8 rounded-lg",
};

export function buttonClasses({ variant = "default", size = "default", className = "" } = {}) {
    return [
        "inline-flex items-center justify-center gap-2 whitespace-nowrap",
        "rounded-button text-sm font-semibold",
        "transition-colors duration-200 focus-visible:outline-none",
        "focus-visible:ring-2 focus-visible:ring-primary",
        "focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:pointer-events-none disabled:opacity-50",
        "aria-disabled:pointer-events-none aria-disabled:opacity-50",
        variants[variant] ?? variants.default,
        sizes[size] ?? sizes.default,
        className,
    ].join(" ");
}

export const fieldClasses = [
    "w-full rounded-button border border-border",
    "bg-surface px-3 py-2 text-sm text-foreground",
    "placeholder:text-muted-light",
    "transition-colors",
    "hover:border-border-strong",
    "focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-primary/40 focus-visible:border-primary",
    "aria-invalid:border-danger aria-invalid:focus-visible:ring-danger/30",
    "disabled:cursor-not-allowed disabled:opacity-50",
].join(" ");
