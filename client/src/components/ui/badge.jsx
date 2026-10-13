
const variants = {
    default: "bg-primary-light text-primary",
    solid: "bg-primary text-white shadow-sm",
    secondary: "bg-surface-muted text-foreground",
    success: "bg-success-light text-success",
    warning: "bg-warning-light text-warning",
    destructive: "bg-danger-light text-danger",
    outline: "border border-border text-foreground",
};

const sizes = {
    default: "gap-1 px-2.5 py-1 text-xs",
    lg: "gap-1.5 px-3 py-1.5 text-sm",
};

export default function Badge({
    variant = "default",
    size = "default",
    className = "",
    children,
    ...props
}) {
    return (
        <span
            className={[
                "inline-flex items-center rounded-full font-semibold",
                sizes[size] ?? sizes.default,
                variants[variant] ?? variants.default,
                className,
            ].join(" ")}
            {...props}
        >
            {children}
        </span>
    );
}
