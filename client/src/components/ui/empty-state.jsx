
export default function EmptyState({ icon: Icon, title, description, action, className = "" }) {
    return (
        <div
            className={[
                "flex flex-col items-center rounded-card border border-dashed border-border-strong",
                "bg-surface/60 px-6 py-14 text-center",
                className,
            ].join(" ")}
        >
            {Icon && (
                <span className="flex size-16 items-center justify-center rounded-full bg-primary-light text-primary">
                    <Icon size={28} aria-hidden="true" />
                </span>
            )}

            <h2 className="mt-5 text-lg font-bold text-foreground">{title}</h2>

            {description && (
                <p className="mt-2 max-w-sm text-sm leading-6 text-muted">{description}</p>
            )}

            {action && <div className="mt-6 flex flex-wrap justify-center gap-3">{action}</div>}
        </div>
    );
}
