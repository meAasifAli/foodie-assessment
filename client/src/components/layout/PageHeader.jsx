
export default function PageHeader({ eyebrow, title, description, children }) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
                {eyebrow && (
                    <p className="text-sm font-bold uppercase tracking-widest text-primary">{eyebrow}</p>
                )}
                <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                    {title}
                </h1>
                {description && <p className="mt-2 text-muted">{description}</p>}
            </div>
            {children}
        </div>
    );
}
