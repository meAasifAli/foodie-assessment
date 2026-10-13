
export default function Skeleton({ className = "", ...props }) {
    return (
        <div
            aria-hidden="true"
            className={[
                "animate-pulse rounded-lg bg-surface-muted",
                className,
            ].join(" ")}
            {...props}
        />
    );
}
