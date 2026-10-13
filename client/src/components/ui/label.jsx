
export default function Label({ className = "", required = false, children, ...props }) {
    return (
        <label
            className={["text-sm font-semibold text-foreground", className].join(" ")}
            {...props}
        >
            {children}
            {required && (
                <span aria-hidden="true" className="ml-0.5 text-primary">
                    *
                </span>
            )}
        </label>
    );
}
