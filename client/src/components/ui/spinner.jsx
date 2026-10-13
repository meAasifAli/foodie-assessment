
const sizes = {
    sm: "size-4 border-2",
    default: "size-6 border-2",
    lg: "size-10 border-[3px]",
};

export default function Spinner({ size = "default", className = "", label }) {
    return (
        <span
            role={label ? "status" : undefined}
            aria-label={label}
            aria-hidden={label ? undefined : "true"}
            className={[
                "inline-block animate-spin rounded-full",
                "border-current border-r-transparent",
                sizes[size] ?? sizes.default,
                className,
            ].join(" ")}
        />
    );
}
