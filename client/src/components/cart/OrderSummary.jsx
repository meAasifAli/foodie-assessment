
import { formatPaise } from "../../lib/money";
import { Card } from "../ui/card";
import Separator from "../ui/separator";

/**
 * Presentational price breakdown shared by cart, checkout and order pages.
 * `lines` is optional: [{ key, name, quantity, totalPaise }].
 */
export default function OrderSummary({
    title = "Order summary",
    lines,
    itemCount,
    subtotalPaise,
    totalPaise = subtotalPaise,
    totalLabel = "Total",
    note,
    children,
    className = "",
}) {
    return (
        <Card as="section" aria-label={title} className={["p-5 sm:p-6", className].join(" ")}>
            <h2 className="text-lg font-bold text-foreground">{title}</h2>

            {lines?.length > 0 && (
                <ul className="mt-4 space-y-3">
                    {lines.map((line) => (
                        <li key={line.key} className="flex items-start justify-between gap-4 text-sm">
                            <span className="min-w-0 text-foreground">
                                <span className="mr-2 inline-flex min-w-7 justify-center rounded-md bg-surface-muted px-1.5 py-0.5 text-xs font-bold tabular-nums">
                                    {line.quantity}×
                                </span>
                                {line.name}
                            </span>
                            <span className="shrink-0 font-semibold tabular-nums">
                                {formatPaise(line.totalPaise)}
                            </span>
                        </li>
                    ))}
                </ul>
            )}

            <Separator className="my-5" />

            <dl className="space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                    <dt className="text-muted">
                        Subtotal
                        {itemCount !== undefined && ` (${itemCount} ${itemCount === 1 ? "item" : "items"})`}
                    </dt>
                    <dd className="font-semibold tabular-nums">{formatPaise(subtotalPaise)}</dd>
                </div>
                <div className="flex justify-between gap-4">
                    <dt className="text-muted">Delivery</dt>
                    <dd className="font-semibold text-success">Free</dd>
                </div>
                <Separator />
                <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-base font-bold text-foreground">{totalLabel}</dt>
                    <dd className="text-xl font-extrabold text-foreground tabular-nums">
                        {formatPaise(totalPaise)}
                    </dd>
                </div>
            </dl>

            {note && <p className="mt-3 text-xs leading-5 text-muted">{note}</p>}

            {children && <div className="mt-6 space-y-3">{children}</div>}
        </Card>
    );
}
