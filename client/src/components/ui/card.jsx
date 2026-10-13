
export function Card({ as: Component = "div", className = "", ...props }) {
    return (
        <Component
            className={[
                "rounded-card border border-border bg-surface",
                "text-foreground shadow-card",
                className,
            ].join(" ")}
            {...props}
        />
    );
}

export function CardHeader({ className = "", ...props }) {
    return (
        <div
            className={["flex flex-col gap-1.5 p-5", className].join(" ")}
            {...props}
        />
    );
}

export function CardTitle({ className = "", ...props }) {
    return (
        <h3
            className={["text-lg font-semibold leading-none", className].join(" ")}
            {...props}
        />
    );
}

export function CardDescription({ className = "", ...props }) {
    return (
        <p
            className={["text-sm text-muted", className].join(" ")}
            {...props}
        />
    );
}

export function CardContent({ className = "", ...props }) {
    return (
        <div
            className={["p-5 pt-0", className].join(" ")}
            {...props}
        />
    );
}

export function CardFooter({ className = "", ...props }) {
    return (
        <div
            className={["flex items-center p-5 pt-0", className].join(" ")}
            {...props}
        />
    );
}
